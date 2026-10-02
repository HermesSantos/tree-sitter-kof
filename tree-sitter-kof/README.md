# tree-sitter-kof

Grammar Tree-sitter mínima para **syntax highlighting** de [Kof](https://koflang.github.io/learn/) (`*.kf`) no Neovim.

Cobre apenas a sintaxe documentada em `learn/` (capítulos 03–07 e 12): funções (`main() {}`,
`Int f(Int a) {}`, `f(Int a): Int {}`, `void f() {}`), `record` (com ou sem corpo), `var`/`val`/
declaração tipada, `if`/`else`, `while`, `for`, `for (var x in xs)`, `break`, `continue`, `return`,
chamadas (`println(...)`, `listOf(...)`, `user.name()`), strings, números, `true`/`false`/`null`,
comentários `//` e `/* */` e operadores básicos.

Não cobre: `switch`, lambdas, genéricos, arrays/`new`, `class`/`interface`, `package`/`import`.

## Instalação no Neovim (nvim-treesitter branch `main`, Neovim 0.12+)

1. Instale o CLI do tree-sitter (o nvim-treesitter usa ele para compilar o parser):

   ```sh
   sudo pacman -S tree-sitter-cli
   ```

2. Configuração mínima (já criada em `~/.config/nvim/lua/plugins/kof.lua`):

   ```lua
   return {
     "nvim-treesitter/nvim-treesitter",
     init = function()
       vim.filetype.add({ extension = { kf = "kof" } })
       vim.api.nvim_create_autocmd("User", {
         pattern = "TSUpdate",
         callback = function()
           require("nvim-treesitter.parsers").kof = {
             install_info = {
               path = "~/Desktop/own_projects/kof_highlight/tree-sitter-kof",
               queries = "queries",
             },
           }
         end,
       })
     end,
   }
   ```

3. Reinicie o Neovim e rode:

   ```vim
   :TSInstall kof
   ```

## Testar

```sh
nvim examples/hello.kf
```

- `:Inspect` com o cursor sobre um token mostra o grupo (`@keyword`, `@function.call`, ...).
- `:InspectTree` mostra a árvore sintática.

## Desenvolvimento

Com o `tree-sitter` do pacman (ou o do `package.json`, via `npx`):

```sh
tree-sitter generate    # gera src/ a partir de grammar.js
tree-sitter test        # roda test/corpus/
tree-sitter parse examples/*.kf --quiet
```

Depois de alterar `grammar.js`, rode `tree-sitter generate` e, no Neovim, `:TSUpdate kof`.
Alterações só em `queries/highlights.scm` valem ao reabrir o arquivo (as queries são um symlink).
