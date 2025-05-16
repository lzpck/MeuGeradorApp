import sys
import webview
import os

"""
Script principal para criar um aplicativo desktop para o gerador de queries
usando pywebview.
"""

# Obtém o diretório onde o script (ou o executável) está localizado
# Isso é importante para que o PyInstaller encontre os arquivos HTML/CSS/JS
if hasattr(sys, '_MEIPASS'):
    # Se estiver rodando como um executável do PyInstaller (modo one-file)
    base_path = sys._MEIPASS
else:
    # Se estiver rodando como um script normal
    base_path = os.path.dirname(os.path.abspath(__file__))

# Constrói o caminho completo para o arquivo HTML
html_file_path = os.path.join(base_path, 'gerador_query_campo_extra.html')
# Garante que o caminho use barras corretas para URLs
html_file_url = f'file:///{html_file_path.replace(os.sep, "/")}'


def main():
    """
    Função principal para criar e iniciar a janela do aplicativo.
    """
    # Cria a janela do webview
    # O título da janela será "Gerador de Queries SQL"
    # O conteúdo carregado será o seu arquivo HTML local
    # Define a largura e altura iniciais da janela
    webview.create_window(
        'Gerador de Queries SQL',  # Título da Janela
        html_file_url,              # URL do arquivo HTML a ser carregado
        width=1000,                 # Largura da janela em pixels
        height=750,                # Altura da janela em pixels
        resizable=True,            # Permite que o usuário redimensione a janela
        text_select=True           # Permite a seleção de texto dentro da webview (útil para copiar o SQL)
    )
    # Inicia o loop de eventos do webview e exibe a janela
    # O gui='cef' ou gui='mshtml' pode ser especificado se o padrão (Edge WebView2) não funcionar
    # Para a maioria dos sistemas Windows modernos, o padrão (None) deve funcionar bem.
    webview.start()

if __name__ == '__main__':
    main()