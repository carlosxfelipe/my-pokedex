# My Pokédex

Este projeto é uma aplicação de consulta de Pokémon desenvolvida com foco em performance e robustez, utilizando técnicas avançadas de cache para otimizar o consumo de dados e evitar o uso excessivo da API externa.

A aplicação foi concebida especialmente para jogadores de Pokémon FireRed e LeafGreen, considerando o recente relançamento destes títulos pela Nintendo. O projeto prioriza a fidelidade aos dados destas versões clássicas.

## Como Rodar o Projeto

Para executar esta aplicação em seu ambiente local, siga os passos abaixo:

1. Clone o repositório oficial em: https://github.com/carlosxfelipe/my-pokedex
2. Certifique-se de ter o Node.js e o ambiente de desenvolvimento (iOS/Android) configurados em sua máquina.
3. No terminal, acesse a pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o projeto no emulador de sua preferência:

   ```bash
   # Para iOS
   npm run ios

   # Para Android
   npm run android
   ```

### Notas Importantes

- **Build de Desenvolvimento**: O projeto utiliza builds de desenvolvimento (Expo Dev Client) e, por isso, **não funciona no Expo Go**.
- **Pastas Nativas**: As pastas `ios/` e `android/` são geradas automaticamente e normalmente são ignoradas pelo Git.
- **Customizações**: Recomenda-se o uso de _config plugins_ do Expo para qualquer customização nativa adicional.

## Arquitetura e Tecnologias

A aplicação combina o ecossistema moderno de React Native com uma estratégia robusta de performance para oferecer uma experiência de consulta rápida e offline:

- **Gerenciamento de Estado e Navegação**: Utiliza **Zustand** para um store leve e escalável, **MMKV** para persistência ultra-rápida de configurações, e **React Navigation** para transições fluidas entre telas.

* **Estratégia de Dados com SQLite**: Toda consulta é persistida via **Expo SQLite**, reduzindo chamadas de rede à PokéAPI. O sistema implementa uma sincronização de "lacunas", buscando apenas IDs ainda não cacheados localmente.
* **Flexibilidade de Versões**: Embora otimizado para as regras de **FireRed & LeafGreen**, o app permite alternar nas configurações para exibir todas as gerações (**National Pokédex**). Inclui alternância de idioma para golpes (**Inglês/Espanhol**) e filtros por tipo.

## Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPLv3)**. Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE). Diferente de licenças mais permissivas (como a MIT), esta licença garante que o código-fonte e quaisquer melhorias feitas por terceiros permaneçam obrigatoriamente abertos e sob os mesmos termos, impedindo o uso do código em softwares proprietários de código fechado.

## Aviso Legal

Pokémon e conteúdos relacionados pertencem aos seus respectivos detentores de direitos. Conforme as informações legais oficiais da franquia, os direitos envolvem The Pokémon Company e Nintendo (além de parceiros históricos como Creatures Inc. e GAME FREAK inc.).

Este aplicativo é um projeto independente, sem afiliação oficial, e utiliza apenas dados públicos disponibilizados pela **PokéAPI**.
