# Gerador de Queries SQL para Campos Extras

## Introdução
Este projeto foi desenvolvido para facilitar a criação de campos extras na empresa Konviva. Ele é um gerador de queries SQL para inclusão de campos extras em módulos específicos, permitindo que os usuários preencham um formulário para gerar automaticamente a query SQL necessária.

## Funcionalidades
- **Seleção de Módulos:** Os usuários podem escolher o módulo específico para o qual desejam adicionar campos extras.
- **Tipos de Campos:** Suporta diferentes tipos de campos, como botões de opção, listas suspensas e checkboxes.
- **Interação com Formulário:** Os usuários podem interagir com o formulário para adicionar, remover e configurar opções de seleção.

## Como Usar e Executar
1. Clone o repositório para sua máquina local.
2. Abra o arquivo `gerador_query_campo_extra.html` em um navegador.
3. Preencha o formulário conforme necessário e clique em "Gerar SQL" para obter a query.
4. Para executar o projeto, navegue até a pasta 'dist' e execute o arquivo 'MeuGeradorSQL.exe'.

## Modificando e Recompilando o Executável
Para alterar o executável, edite o código-fonte disponível no arquivo 'main.py'. Após realizar as alterações nos arquivos HTML, CSS e JS, é necessário recompilar o projeto para incluir as versões atualizadas desses arquivos no executável. Utilize o seguinte comando:

```bash
pyinstaller --name MeuGeradorSQL --onefile --windowed --add-data "gerador_query_campo_extra.html:." --add-data "gerador_query_campo_extra.css:." --add-data "gerador_query_campo_extra.js:." main.py
```

Alternativamente, você pode usar o arquivo `.spec` gerado na primeira execução do PyInstaller. Este arquivo contém todas as configurações necessárias e pode ser utilizado para futuras compilações:

```bash
pyinstaller MeuGeradorSQL.spec
```

Ambos os métodos garantirão que as versões atualizadas dos arquivos sejam incluídas no executável.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Contato
Para dúvidas ou sugestões, entre em contato através do email: [leandro.medeiros@senior.com.br](mailto:leandro.medeiros@senior.com.br).