# tree-sitter-kof

Grammar Tree-sitter mínima para **syntax highlighting** de [Kof](https://koflang.github.io/learn/) (`*.kf`) no Neovim.

Cobre apenas a sintaxe documentada em `learn/` (capítulos 03–07 e 12): funções (`main() {}`,
`Int f(Int a) {}`, `f(Int a): Int {}`, `void f() {}`), `record` (com ou sem corpo), `var`/`val`/
declaração tipada, `if`/`else`, `while`, `for`, `for (var x in xs)`, `break`, `continue`, `return`,
chamadas (`println(...)`, `listOf(...)`, `user.name()`), strings, números, `true`/`false`/`null`,
comentários `//` e `/* */` e operadores básicos.

Não cobre: `switch`, lambdas, genéricos, arrays/`new`, `class`/`interface`, `package`/`import`.

## Instalação no Neovim (nvim-treesitter branch `main`, Neovim 0.12+)

1. Instale o CLI do tree-sitter e um compilador C (o nvim-treesitter usa os dois para compilar o parser).
   No Arch:

   ```sh
   sudo pacman -S tree-sitter-cli
   ```

2. Adicione a configuração mínima, por exemplo em `~/.config/nvim/lua/plugins/kof.lua` (LazyVim/lazy.nvim):

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
               url = "https://github.com/HermesSantos/tree-sitter-kof",
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

Depois de alterar `grammar.js`, rode `tree-sitter generate`, faça commit e push (incluindo `src/`) e,
no Neovim, `:TSUpdate kof`.

Para testar mudanças sem push, troque `url = ...` por `path = "<caminho do clone local>"` na
configuração e rode `:TSInstall! kof`.
