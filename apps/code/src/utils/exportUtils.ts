import domtoimage from 'dom-to-image';

export interface ExportToImageOptions {
  element: HTMLElement;
  filename: string;
  windowTitle?: string;
  language?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
}

export async function exportToImage({
  element,
  filename,
  windowTitle = 'QuikCode',
  language = 'javascript',
  format = 'png'
}: ExportToImageOptions): Promise<void> {
  try {
    // Crie o wrapper com estilo macOS
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      background: linear-gradient(180deg, #f6f8fa 0%, #ffffff 100%);
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-width: 800px;
      overflow: hidden;
    `;

    // Verifique se o modo escuro está ativo
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      wrapper.style.background = 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)';
    }

    // Crie o cabeçalho da janela
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid ${isDark ? '#333' : '#e1e5e9'};
      background: ${isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.8)'};
    `;

    // Controles da janela (pontos vermelho, amarelo, verde)
    const controls = document.createElement('div');
    controls.style.cssText = `
      display: flex;
      gap: 8px;
      margin-right: 16px;
    `;
    
    ['#ff5f56', '#ffbd2e', '#27ca3f'].forEach(color => {
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${color};
      `;
      controls.appendChild(dot);
    });

    // Título da janela
    const title = document.createElement('div');
    title.style.cssText = `
      color: ${isDark ? '#e5e7eb' : '#374151'};
      font-size: 14px;
      font-weight: 500;
      flex: 1;
      text-align: center;
      margin-right: 80px;
    `;
    title.textContent = `${windowTitle} - ${language}`;

    header.appendChild(controls);
    header.appendChild(title);

    // Clone e estilize o conteúdo
    const content = element.cloneNode(true) as HTMLElement;
    content.style.cssText = `
      margin: 0;
      border-radius: 0;
      border: none;
      background: transparent;
      overflow: hidden;
    `;

    // Wrapper do conteúdo com padding
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = `
      padding: 20px;
      background: ${isDark ? '#0d1117' : '#ffffff'};
    `;
    contentWrapper.appendChild(content);

    wrapper.appendChild(header);
    wrapper.appendChild(contentWrapper);
    
    // Adicione temporariamente à página para capturar
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-10000px';
    wrapper.style.left = '-10000px';
    document.body.appendChild(wrapper);

    // Espere para garantir que tudo seja renderizado
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture a imagem com dom-to-image
    let dataUrl;
    if (format === 'jpeg') {
      dataUrl = await domtoimage.toJpeg(wrapper, { quality: 0.92 });
    } else {
      dataUrl = await domtoimage.toPng(wrapper);
    }

    // Limpe
    document.body.removeChild(wrapper);

    // Faça o download da imagem
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
}