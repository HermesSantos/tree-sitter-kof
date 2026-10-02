/**
 * @file Minimal Kof grammar for syntax highlighting
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  assign: 1,
  or: 2,
  and: 3,
  equality: 4,
  relational: 5,
  additive: 6,
  multiplicative: 7,
  unary: 8,
  postfix: 9,
  call: 10,
};

const commaSep = (rule) => optional(seq(rule, repeat(seq(',', rule))));

module.exports = grammar({
  name: 'kof',

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat(choice($.function_declaration, $.record_declaration)),

    // main() {}, Int f(Int a) {}, f(Int a): Int {}, void f() {}
    function_declaration: ($) =>
      seq(
        optional(field('type', $._type)),
        field('name', $.identifier),
        field('parameters', $.parameters),
        optional(seq(':', field('type', $._type))),
        field('body', $.block),
      ),

    record_declaration: ($) =>
      seq(
        'record',
        field('name', $._type_identifier),
        field('parameters', $.parameters),
        optional(field('body', $.record_body)),
      ),

    record_body: ($) => seq('{', repeat($.function_declaration), '}'),

    parameters: ($) => seq('(', commaSep($.parameter), ')'),

    parameter: ($) => seq(field('type', $._type), field('name', $.identifier)),

    _type: ($) => choice($._type_identifier, $.void_type),

    _type_identifier: ($) => prec(1, alias($.identifier, $.type_identifier)),

    void_type: (_) => 'void',

    block: ($) => seq('{', repeat($._statement), '}'),

    _statement: ($) =>
      choice(
        $.block,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.for_in_statement,
        seq(
          choice(
            $.variable_declaration,
            $.return_statement,
            $.break_statement,
            $.continue_statement,
            $.expression_statement,
          ),
          optional(';'),
        ),
      ),

    variable_declaration: ($) =>
      seq(
        choice('var', 'val', field('type', $._type)),
        field('name', $.identifier),
        '=',
        field('value', $._expression),
      ),

    return_statement: ($) => prec.right(seq('return', optional($._expression))),

    break_statement: (_) => 'break',

    continue_statement: (_) => 'continue',

    expression_statement: ($) => $._expression,

    if_statement: ($) =>
      prec.right(
        seq(
          'if',
          field('condition', $.parenthesized_expression),
          field('consequence', $._statement),
          optional(seq('else', field('alternative', $._statement))),
        ),
      ),

    while_statement: ($) =>
      seq('while', field('condition', $.parenthesized_expression), field('body', $._statement)),

    for_statement: ($) =>
      seq(
        'for',
        '(',
        optional(field('init', choice($.variable_declaration, $._expression))),
        ';',
        optional(field('condition', $._expression)),
        ';',
        optional(field('update', $._expression)),
        ')',
        field('body', $._statement),
      ),

    for_in_statement: ($) =>
      seq(
        'for',
        '(',
        choice('var', 'val'),
        field('name', $.identifier),
        'in',
        field('iterable', $._expression),
        ')',
        field('body', $._statement),
      ),

    _expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.string,
        $.true,
        $.false,
        $.null,
        $.parenthesized_expression,
        $.call_expression,
        $.field_access,
        $.unary_expression,
        $.binary_expression,
        $.update_expression,
        $.assignment_expression,
      ),

    parenthesized_expression: ($) => seq('(', $._expression, ')'),

    call_expression: ($) =>
      prec(PREC.call, seq(field('function', $._expression), field('arguments', $.arguments))),

    arguments: ($) => seq('(', commaSep($._expression), ')'),

    field_access: ($) =>
      prec(PREC.call, seq(field('object', $._expression), '.', field('field', $.identifier))),

    unary_expression: ($) =>
      prec(PREC.unary, seq(field('operator', choice('!', '-')), field('operand', $._expression))),

    update_expression: ($) =>
      prec.left(PREC.postfix, seq(field('operand', $._expression), field('operator', choice('++', '--')))),

    assignment_expression: ($) =>
      prec.right(
        PREC.assign,
        seq(
          field('left', choice($.identifier, $.field_access)),
          field('operator', choice('=', '+=', '-=', '*=', '/=', '%=')),
          field('right', $._expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        ...[
          ['||', PREC.or],
          ['&&', PREC.and],
          ['==', PREC.equality],
          ['!=', PREC.equality],
          ['<', PREC.relational],
          ['<=', PREC.relational],
          ['>', PREC.relational],
          ['>=', PREC.relational],
          ['+', PREC.additive],
          ['-', PREC.additive],
          ['*', PREC.multiplicative],
          ['/', PREC.multiplicative],
          ['%', PREC.multiplicative],
        ].map(([operator, precedence]) =>
          prec.left(
            precedence,
            seq(
              field('left', $._expression),
              field('operator', operator),
              field('right', $._expression),
            ),
          ),
        ),
      ),

    identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // 42, 42L, 3.14, 3.14f
    number: (_) => token(seq(/\d+/, optional(seq('.', /\d+/)), optional(/[lLfF]/))),

    string: ($) => seq('"', repeat(choice($.string_content, $.escape_sequence)), '"'),

    string_content: (_) => token.immediate(prec(1, /[^"\\\n]+/)),

    escape_sequence: (_) => token.immediate(seq('\\', choice(/[\\"nrt0bf]/, /u[0-9a-fA-F]{4}/))),

    true: (_) => 'true',

    false: (_) => 'false',

    null: (_) => 'null',

    line_comment: (_) => token(seq('//', /.*/)),

    block_comment: (_) => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),
  },
});
