# YouTube Downloader 2026

Um projeto moderno para download de vídeos do YouTube em alta qualidade (1080p, 4K), construído com **Next.js** no frontend e **Node.js** com **yt-dlp** no backend.

## 🚀 Como Executar o Projeto

### Pré-requisitos
Como o projeto usa ferramentas externas para download e fusão de vídeos de alta qualidade, você precisará baixar dois executáveis para a pasta `backend/`:
1. [yt-dlp.exe](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe)
2. [ffmpeg.exe](https://github.com/GyanD/codexffmpeg/releases/tag/7.1) (Baixe os binários e coloque o `ffmpeg.exe` na pasta `backend/`).

### Configuração do Backend
1. Entre na pasta `backend`: `cd backend`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` com a porta desejada (padrão 4000).
4. (Opcional) Adicione um arquivo `cookies.json` se encontrar vídeos bloqueados.
5. Inicie o servidor: `npm run dev`

### Configuração do Frontend
1. Entre na pasta `frontend`: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o Next.js: `npm run dev`
4. Acesse em `http://localhost:3000`.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** Next.js 16 (App Router), Tailwind CSS, TypeScript.
- **Backend:** Node.js, Express, yt-dlp (Engine de Download), FFmpeg (Fusão de Áudio/Vídeo).

## ⚠️ Aviso Legal
Este projeto foi desenvolvido apenas para fins educacionais. Respeite os direitos autorais e os termos de serviço do YouTube ao utilizar esta ferramenta.
