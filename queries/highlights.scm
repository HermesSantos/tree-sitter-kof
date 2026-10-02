; Later patterns take precedence over earlier ones.

(identifier) @variable

(type_identifier) @type

((type_identifier) @type.builtin
  (#any-of? @type.builtin "Bool" "Byte" "Short" "Int" "Long" "Float" "Double" "Char" "Void" "String"))

(void_type) @type.builtin

(parameter
  name: (identifier) @variable.parameter)

(field_access
  field: (identifier) @property)

; Functions

(function_declaration
  name: (identifier) @function)

(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (field_access
    field: (identifier) @function.method.call))

((call_expression
  function: (identifier) @function.builtin)
  (#any-of? @function.builtin "print" "println" "listOf"))

; Literals

(string) @string

(escape_sequence) @string.escape

(number) @number

[
  (true)
  (false)
] @boolean

(null) @constant.builtin

[
  (line_comment)
  (block_comment)
] @comment

; Keywords

[
  "var"
  "val"
  "in"
] @keyword

"record" @keyword.type

"return" @keyword.return

[
  "if"
  "else"
] @keyword.conditional

[
  "for"
  "while"
  (break_statement)
  (continue_statement)
] @keyword.repeat

; Operators and punctuation

[
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "+"
  "-"
  "*"
  "/"
  "%"
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
  "!"
  "++"
  "--"
] @operator

[
  "("
  ")"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  "."
  ":"
  ";"
] @punctuation.delimiter
