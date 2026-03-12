const express = require('express');
const cors = require('cors');
const execa = require('execa');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const YT_DLP_PATH = path.join(__dirname, 'yt-dlp.exe');
const FFMPEG_PATH = path.join(__dirname, 'ffmpeg.exe');

// Endpoint para buscar todas as informações de qualidade (incluindo 1080p+)
app.get('/api/info', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL do YouTube é obrigatória.' });
    }

    try {
        const { stdout } = await execa(YT_DLP_PATH, [
            '-j', 
            '--no-playlist',
            url
        ]);

        const info = JSON.parse(stdout);
        
        // Agora vamos filtrar todos os formatos que têm vídeo (vcodec diferente de none)
        // O yt-dlp se encarregará de baixar o melhor áudio e fundir se for necessário
        const formats = info.formats
            .filter(f => f.vcodec !== 'none' && (f.ext === 'mp4' || f.ext === 'webm'))
            .map(f => ({
                quality: f.format_note || f.resolution,
                container: f.ext,
                itag: f.format_id,
                filesize: f.filesize ? (f.filesize / 1024 / 1024).toFixed(2) + ' MB' : 'Varia'
            }))
            // Remover duplicatas de qualidade para não poluir o frontend
            .filter((v, i, a) => a.findIndex(t => t.quality === v.quality) === i);

        const videoDetails = {
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
            formats: formats
        };

        res.json(videoDetails);
    } catch (error) {
        console.error('Erro ao buscar info com yt-dlp:', error.stderr || error.message);
        res.status(500).json({ error: 'Falha ao buscar informações do vídeo via yt-dlp.' });
    }
});

// Endpoint para realizar o download com fusão de áudio/vídeo se necessário
app.get('/api/download', async (req, res) => {
    const { url, itag } = req.query;

    if (!url) {
        return res.status(400).send('URL inválida.');
    }

    try {
        const { stdout: titleInfo } = await execa(YT_DLP_PATH, ['--get-title', url]);
        const title = titleInfo.trim().replace(/[^\w\s]/gi, '');

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // Agora usamos o FFmpeg para garantir que se o itag for apenas vídeo, o áudio seja incluído
        // A sintaxe "itag+bestaudio" diz: pegue esse vídeo e o melhor áudio disponível e junte-os
        const subprocess = execa(YT_DLP_PATH, [
            '-f', `${itag}+bestaudio[ext=m4a]/best[ext=mp4]/best`,
            '--ffmpeg-location', FFMPEG_PATH,
            '--merge-output-format', 'mp4',
            '-o', '-', 
            url
        ]);

        subprocess.stdout.pipe(res);

        subprocess.on('error', (err) => {
            console.error('Erro no processo de download:', err);
        });

    } catch (error) {
        console.error('Erro no download com yt-dlp:', error.stderr || error.message);
        res.status(500).send('Erro ao processar o download.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de alta qualidade (1080p+) rodando em http://localhost:${PORT}`);
});
