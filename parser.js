/* =========================================================
   LOGIC & TRUTH VALUE SIMULATOR
   Parser Engine

   Responsibilities:
   1. Tokenization
   2. Syntax validation
   3. Recursive-descent parsing
   4. Abstract Syntax Tree generation
========================================================= */

/* =========================================================
   TOKEN TYPES
========================================================= */

const TokenType = Object.freeze({

    VARIABLE: "VARIABLE",

    NOT: "NOT",

    AND: "AND",

    OR: "OR",

    IMPLIES: "IMPLIES",

    IFF: "IFF",

    LPAREN: "LPAREN",

    RPAREN: "RPAREN",

    EOF: "EOF"

});

/* =========================================================
   TOKEN
========================================================= */

class Token {

    constructor(type, value, position) {

        this.type = type;

        this.value = value;

        this.position = position;
    }

}

/* =========================================================
   LEXER
========================================================= */

class LogicLexer {

    constructor(input) {

        this.input = input;

        this.position = 0;

        this.tokens = [];
    }

    tokenize() {

        while (!this.isAtEnd()) {

            this.skipWhitespace();

            if (this.isAtEnd()) {
                break;
            }

            const startPosition = this.position;

            const current = this.peek();

            /* Parentheses */

            if (current === "(") {

                this.tokens.push(
                    new Token(
                        TokenType.LPAREN,
                        "(",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            if (current === ")") {

                this.tokens.push(
                    new Token(
                        TokenType.RPAREN,
                        ")",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            /* Negation */

            if (
                current === "~" ||
                current === "¬"
            ) {

                this.tokens.push(
                    new Token(
                        TokenType.NOT,
                        "NOT",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            /* AND */

            if (current === "^" || current === "∧") {

                this.tokens.push(
                    new Token(
                        TokenType.AND,
                        "AND",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            /* OR */

            if (current === "∨") {

                this.tokens.push(
                    new Token(
                        TokenType.OR,
                        "OR",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            /* && */

            if (
                current === "&" &&
                this.peekNext() === "&"
            ) {

                this.tokens.push(
                    new Token(
                        TokenType.AND,
                        "AND",
                        startPosition
                    )
                );

                this.advance();

                this.advance();

                continue;
            }

            /* || */

            if (
                current === "|" &&
                this.peekNext() === "|"
            ) {

                this.tokens.push(
                    new Token(
                        TokenType.OR,
                        "OR",
                        startPosition
                    )
                );

                this.advance();

                this.advance();

                continue;
            }

            /* -> */

            if (
                current === "-" &&
                this.peekNext() === ">"
            ) {

                this.tokens.push(
                    new Token(
                        TokenType.IMPLIES,
                        "IMPLIES",
                        startPosition
                    )
                );

                this.advance();

                this.advance();

                continue;
            }

            /* <-> */

            if (
                current === "<" &&
                this.peekNext() === "-"
            ) {

                if (
                    this.input[this.position + 2] === ">"
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.IFF,
                            "IFF",
                            startPosition
                        )
                    );

                    this.advance();
                    this.advance();
                    this.advance();

                    continue;
                }

            }

            /* Unicode arrows */

            if (current === "→") {

                this.tokens.push(
                    new Token(
                        TokenType.IMPLIES,
                        "IMPLIES",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            if (current === "↔") {

                this.tokens.push(
                    new Token(
                        TokenType.IFF,
                        "IFF",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            /* ASCII OR "v" */

            if (
                current === "v" ||
                current === "V"
            ) {

                this.tokens.push(
                    new Token(
                        TokenType.OR,
                        "OR",
                        startPosition
                    )
                );

                this.advance();

                continue;
            }

            /* Words */

            if (this.isLetter(current)) {

                const word =
                    this.readWord();

                const normalized =
                    word.toUpperCase();

                if (
                    normalized === "NOT"
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.NOT,
                            "NOT",
                            startPosition
                        )
                    );

                    continue;
                }

                if (
                    normalized === "AND"
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.AND,
                            "AND",
                            startPosition
                        )
                    );

                    continue;
                }

                if (
                    normalized === "OR"
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.OR,
                            "OR",
                            startPosition
                        )
                    );

                    continue;
                }

                if (
                    normalized === "IMPLIES"
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.IMPLIES,
                            "IMPLIES",
                            startPosition
                        )
                    );

                    continue;
                }

                if (
                    normalized === "IFF"
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.IFF,
                            "IFF",
                            startPosition
                        )
                    );

                    continue;
                }

                /*
                    Variables are single letters.
                    P, Q, R, S, etc.
                */

                if (
                    /^[A-Z]$/i.test(word)
                ) {

                    this.tokens.push(
                        new Token(
                            TokenType.VARIABLE,
                            word.toUpperCase(),
                            startPosition
                        )
                    );

                    continue;
                }

                throw new Error(
                    `Unknown identifier "${word}" at position ${startPosition + 1}.`
                );
            }

            throw new Error(
                `Unexpected symbol "${current}" at position ${startPosition + 1}.`
            );
        }

        this.tokens.push(
            new Token(
                TokenType.EOF,
                null,
                this.position
            )
        );

        return this.tokens;
    }

    skipWhitespace() {

        while (
            !this.isAtEnd() &&
            /\s/.test(this.peek())
        ) {

            this.advance();
        }
    }

    readWord() {

        const start =
            this.position;

        while (
            !this.isAtEnd() &&
            /[A-Za-z]/.test(this.peek())
        ) {

            this.advance();
        }

        return this.input.slice(
            start,
            this.position
        );
    }

    isLetter(character) {

        return (
            character !== undefined &&
            /[A-Za-z]/.test(character)
        );
    }

    peek() {

        return this.input[this.position];
    }

    peekNext() {

        return this.input[this.position + 1];
    }

    advance() {

        this.position++;
    }

    isAtEnd() {

        return (
            this.position >= this.input.length
        );
    }

}

/* =========================================================
   AST NODE FACTORIES
========================================================= */

function variableNode(name) {

    return {

        type: "VARIABLE",

        name

    };
}

function unaryNode(operator, operand) {

    return {

        type: "UNARY",

        operator,

        operand

    };
}

function binaryNode(operator, left, right) {

    return {

        type: "BINARY",

        operator,

        left,

        right

    };
}

/* =========================================================
   PARSER
========================================================= */

class LogicParser {

    constructor(tokens) {

        this.tokens = tokens;

        this.current = 0;
    }

    parse() {

        if (
            this.check(TokenType.EOF)
        ) {

            throw new Error(
                "The formula cannot be empty."
            );
        }

        const expression =
            this.parseIff();

        if (
            !this.check(TokenType.EOF)
        ) {

            const token =
                this.peek();

            throw new Error(
                `Unexpected token "${this.displayToken(token)}" at position ${token.position + 1}.`
            );
        }

        return expression;
    }

    /*
        Precedence, lowest to highest:

        IFF
        IMPLIES
        OR
        AND
        NOT
        PRIMARY
    */

    parseIff() {

        let expression =
            this.parseImplication();

        while (
            this.match(TokenType.IFF)
        ) {

            const right =
                this.parseImplication();

            expression =
                binaryNode(
                    "IFF",
                    expression,
                    right
                );
        }

        return expression;
    }

    parseImplication() {

        let expression =
            this.parseOr();

        if (
            this.match(TokenType.IMPLIES)
        ) {

            const right =
                this.parseImplication();

            expression =
                binaryNode(
                    "IMPLIES",
                    expression,
                    right
                );
        }

        return expression;
    }

    parseOr() {

        let expression =
            this.parseAnd();

        while (
            this.match(TokenType.OR)
        ) {

            const right =
                this.parseAnd();

            expression =
                binaryNode(
                    "OR",
                    expression,
                    right
                );
        }

        return expression;
    }

    parseAnd() {

        let expression =
            this.parseNot();

        while (
            this.match(TokenType.AND)
        ) {

            const right =
                this.parseNot();

            expression =
                binaryNode(
                    "AND",
                    expression,
                    right
                );
        }

        return expression;
    }

    parseNot() {

        if (
            this.match(TokenType.NOT)
        ) {

            return unaryNode(
                "NOT",
                this.parseNot()
            );
        }

        return this.parsePrimary();
    }

    parsePrimary() {

        if (
            this.match(TokenType.VARIABLE)
        ) {

            const token =
                this.previous();

            return variableNode(
                token.value
            );
        }

        if (
            this.match(TokenType.LPAREN)
        ) {

            const expression =
                this.parseIff();

            if (
                !this.match(TokenType.RPAREN)
            ) {

                const token =
                    this.peek();

                throw new Error(
                    `Missing closing parenthesis ")" near position ${token.position + 1}.`
                );
            }

            return expression;
        }

        const token =
            this.peek();

        if (
            token.type === TokenType.EOF
        ) {

            throw new Error(
                "The formula ends unexpectedly. An expression is required."
            );
        }

        throw new Error(
            `Expected a variable or "(". Found "${this.displayToken(token)}" at position ${token.position + 1}.`
        );
    }

    match(...types) {

        for (
            const type of types
        ) {

            if (
                this.check(type)
            ) {

                this.advance();

                return true;
            }
        }

        return false;
    }

    check(type) {

        return (
            this.peek().type === type
        );
    }

    advance() {

        if (
            !this.isAtEnd()
        ) {

            this.current++;
        }

        return this.previous();
    }

    isAtEnd() {

        return (
            this.peek().type === TokenType.EOF
        );
    }

    peek() {

        return this.tokens[this.current];
    }

    previous() {

        return this.tokens[this.current - 1];
    }

    displayToken(token) {

        if (
            token.type === TokenType.EOF
        ) {

            return "end of formula";
        }

        return token.value;
    }

}

/* =========================================================
   PUBLIC PARSE FUNCTION
========================================================= */

function parseFormula(input) {

    if (
        typeof input !== "string"
    ) {

        throw new Error(
            "Formula must be a text string."
        );
    }

    const cleaned =
        input.trim();

    if (
        cleaned.length === 0
    ) {

        throw new Error(
            "Please enter a logical formula."
        );
    }

    const lexer =
        new LogicLexer(cleaned);

    const tokens =
        lexer.tokenize();

    const parser =
        new LogicParser(tokens);

    const ast =
        parser.parse();

    return {

        input: cleaned,

        tokens,

        ast

    };
}

/* =========================================================
   AST TO DISPLAY STRING
========================================================= */

function astToString(node, parentPrecedence = 0) {

    if (
        node.type === "VARIABLE"
    ) {

        return node.name;
    }

    if (
        node.type === "UNARY"
    ) {

        const text =
            "~" +
            astToString(
                node.operand,
                5
            );

        return parentPrecedence > 5
            ? `(${text})`
            : text;
    }

    const precedenceMap = {

        IFF: 1,

        IMPLIES: 2,

        OR: 3,

        AND: 4

    };

    const symbols = {

        IFF: "<->",

        IMPLIES: "->",

        OR: "v",

        AND: "^"

    };

    const precedence =
        precedenceMap[node.operator];

    const left =
        astToString(
            node.left,
            precedence
        );

    const right =
        astToString(
            node.right,
            precedence
        );

    const text =
        `${left} ${symbols[node.operator]} ${right}`;

    if (
        precedence < parentPrecedence
    ) {

        return `(${text})`;
    }

    return text;
}

/* =========================================================
   COLLECT VARIABLES
========================================================= */

function collectVariables(node, variables = new Set()) {

    if (
        node.type === "VARIABLE"
    ) {

        variables.add(
            node.name
        );

        return variables;
    }

    if (
        node.type === "UNARY"
    ) {

        collectVariables(
            node.operand,
            variables
        );

        return variables;
    }

    if (
        node.type === "BINARY"
    ) {

        collectVariables(
            node.left,
            variables
        );

        collectVariables(
            node.right,
            variables
        );
    }

    return variables;
}

/* =========================================================
   EXPOSE GLOBAL API
========================================================= */

window.LogicParserAPI = {

    parseFormula,

    astToString,

    collectVariables,

    TokenType

};