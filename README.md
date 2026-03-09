# My Pokédex

Aplicativo mobile desenvolvido com **React Native** (Expo) para iOS e Android, focado em consulta de Pokémon com performance e robustez, utilizando técnicas avançadas de cache para otimizar o consumo de dados e evitar o uso excessivo da API externa.

A aplicação foi concebida especialmente para jogadores de Pokémon FireRed e LeafGreen, considerando o recente relançamento destes títulos pela Nintendo. O projeto prioriza a fidelidade aos dados destas versões clássicas.

## Como Rodar o Projeto

Para executar esta aplicação em seu ambiente local, siga os passos abaixo:

1. Clone o repositório oficial:
   ```bash
   git clone https://github.com/carlosxfelipe/my-pokedex.git
   cd my-pokedex
   ```
2. Certifique-se de ter o Node.js e o ambiente de desenvolvimento (iOS/Android) configurados em sua máquina.
3. No terminal, acesse a pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o projeto no emulador de sua preferência:

   ```bash
   # Para iOS
   npm run ios
   ```

   ```bash
   # Para Android
   npm run android
   ```

### Notas Importantes

- **Build de Desenvolvimento**: O projeto utiliza builds de desenvolvimento (Expo Dev Client) e, por isso, **não funciona no Expo Go**.
- **Pastas Nativas**: As pastas `ios/` e `android/` são geradas automaticamente e normalmente são ignoradas pelo Git.
- **Customizações**: Recomenda-se o uso de _config plugins_ do Expo para qualquer customização nativa adicional.

## Arquitetura e Tecnologias

O app utiliza **Expo SQLite** para persistir localmente os dados da PokéAPI, buscando da rede apenas os IDs ainda não cacheados. As configurações do usuário são salvas com **MMKV**, garantindo leitura e escrita ultra-rápidas. O estado global é gerenciado com **Zustand** e a navegação com **React Navigation**.

## Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPLv3)**. Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE). Diferente de licenças mais permissivas (como a MIT), esta licença garante que o código-fonte e quaisquer melhorias feitas por terceiros permaneçam obrigatoriamente abertos e sob os mesmos termos, impedindo o uso do código em softwares proprietários de código fechado.

## Aviso Legal

Pokémon e conteúdos relacionados pertencem aos seus respectivos detentores de direitos. Conforme as informações legais oficiais da franquia, os direitos envolvem The Pokémon Company e Nintendo (além de parceiros históricos como Creatures Inc. e GAME FREAK inc.).

Este aplicativo é um projeto independente, sem afiliação oficial, e utiliza apenas dados públicos disponibilizados pela **PokéAPI**.
