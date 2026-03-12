'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchInfo = async () => {
    if (!url) return;
    
    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch(`http://localhost:4000/api/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (response.ok) {
        setVideoInfo(data);
      } else {
        setError(data.error || 'Erro ao buscar informações do vídeo.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (itag: number) => {
    // Redireciona para o endpoint de download do backend
    // O navegador tratará isso automaticamente como um download de arquivo
    const downloadUrl = `http://localhost:4000/api/download?url=${encodeURIComponent(url)}&itag=${itag}`;
    window.location.assign(downloadUrl);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-2">YouTube Downloader</h1>
          <p className="text-gray-400">Cole o link do vídeo abaixo para começar</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleFetchInfo}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-4 rounded-lg font-bold transition-colors"
          >
            {loading ? 'Buscando...' : 'Analisar'}
          </button>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {videoInfo && (
          <div className="mt-8 border-t border-gray-700 pt-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full md:w-64 rounded-lg shadow-lg object-cover"
              />
              <div className="flex-1 space-y-4">
                <h2 className="text-xl font-semibold leading-tight">{videoInfo.title}</h2>
                <p className="text-gray-400 text-sm">Duração: {Math.floor(videoInfo.duration / 60)} min</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Qualidades disponíveis:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {videoInfo.formats.map((format: any) => (
                      <button
                        key={format.itag}
                        onClick={() => handleDownload(format.itag)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 p-2 rounded border border-gray-600 transition-colors"
                      >
                        {format.quality} ({format.container})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
