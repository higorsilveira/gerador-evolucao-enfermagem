# Gerador de Evolução de Enfermagem — MVP

MVP estático para gerar evolução de enfermagem a partir de campos opcionais.

## Objetivo

Ajudar na visita de enfermagem, permitindo preencher apenas os dados aplicáveis ao paciente e gerar automaticamente uma evolução textual pronta para copiar e revisar.

## Privacidade

Esta versão **não usa backend**, **não usa banco de dados** e **não envia dados para servidor**.

- A evolução é gerada no próprio navegador.
- O botão **Salvar rascunho local** usa apenas `localStorage` do dispositivo.
- Para evitar armazenamento de dados sensíveis, use o rascunho local com cautela e limpe os dados ao final do uso.

## Como testar localmente

Opção simples:

1. Abra a pasta do projeto.
2. Dê dois cliques em `index.html`.
3. Preencha os campos e copie a evolução gerada.

Opção com servidor local:

```bash
python -m http.server 8080
```

Depois acesse:

```txt
http://localhost:8080
```

## Como publicar no Cloudflare Pages

### Modo mais simples: upload direto

1. Acesse Cloudflare Dashboard.
2. Vá em **Workers & Pages**.
3. Clique em **Create application**.
4. Escolha **Pages**.
5. Escolha **Upload assets**.
6. Envie os arquivos desta pasta.

### Modo com GitHub

1. Crie um repositório no GitHub.
2. Envie estes arquivos para o repositório.
3. No Cloudflare Pages, escolha **Connect to Git**.
4. Selecione o repositório.
5. Como é um projeto estático sem build:
   - Build command: deixe em branco.
   - Build output directory: `/` ou deixe o padrão conforme a tela permitir.

## Arquivos principais

```txt
index.html       Estrutura da tela e campos
styles.css       Visual mobile-first
app.js           Regras de geração da evolução
_headers         Cabeçalhos básicos de segurança para Cloudflare Pages
public/manifest.json  Manifesto básico para instalação como app/PWA
```

## Recursos disponíveis no MVP

- Blocos expansíveis por assunto.
- Campos opcionais: campo vazio não gera frase.
- Botão **Paciente padrão**.
- Geração automática da evolução.
- Diagnósticos automáticos com opção de forçar Sim/Não.
- Condutas rápidas com marcação automática por contexto.
- Botão **Copiar evolução**.
- Botão **Salvar rascunho local**.
- Botão **Baixar .txt**.
- Layout otimizado para celular e tablet.

## Próximos passos sugeridos

1. Separar modelos por perfil: ortopedia, clínica médica, pós-operatório, TQT, dreno e tração.
2. Adicionar botão de “evolução resumida” e “evolução completa”.
3. Adicionar favoritos de frases.
4. Transformar em PWA offline completo com service worker.
5. Criar revisão guiada antes de copiar para o prontuário.

## Observação importante

Este app é um apoio para padronização e agilidade do registro. A evolução gerada deve ser revisada por profissional habilitado antes de uso em prontuário.
