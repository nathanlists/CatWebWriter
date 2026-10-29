import * as examples from './examples.js';

console.log("Loaded main.js")

const button = document.getElementById('codesubmit');
const button2 = document.getElementById('indent');
const button3 = document.getElementById('changealias');
let scriptAlias = "Compiled Script";

const ops = {
    "==": 18,
    "<": 20,
    ">": 21
}
const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3
};

function changeAlias() {
    let text = prompt("New alias: ");
    if (text !== null) {
        scriptAlias = text;

    }
}

function indentLine() {
    const textarea = document.getElementById("message");
    const pos = textarea.selectionStart;
    const text = textarea.value;

    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;

    textarea.setRangeText(
        "    ",
        lineStart,
        lineStart,
        "preserve"
    );

    textarea.focus();
}

function infixToPostfix(expression) {
    const tokens = expression.match(
        /\d+(?:\.\d*)?|\.\d+|[+\-*/^()]|\S/g
    );

    if (!tokens) return [];

    const output = [];
    const operators = [];

    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "u-": 3,
        "^": 4
    };

    const rightAssociative = new Set(["^", "u-"]);
    let expectOperand = true;

    for (const originalToken of tokens) {
        let token = originalToken;

        if (/^\d+(?:\.\d*)?$|^\.\d+$/.test(token)) {
            if (!expectOperand) {
                throw new Error(`Syntax Error: Unexpected number: ${token}`);
            }

            output.push(token);
            expectOperand = false;

        } else if (token === "-" && expectOperand) {
            token = "u-";

            while (operators.length > 0) {
                const top = operators.at(-1);

                if (!(top in precedence)) break;

                if (
                    precedence[top] > precedence[token] ||
                    (
                        precedence[top] === precedence[token] &&
                        !rightAssociative.has(token)
                    )
                ) {
                    output.push(operators.pop());
                } else {
                    break;
                }
            }

            operators.push(token);
            expectOperand = true;

        } else if (token in precedence) {
            if (expectOperand) {
                throw new Error(
                    `Syntax Error: Unexpected operator: ${token}`
                );
            }

            while (operators.length > 0) {
                const top = operators.at(-1);

                if (!(top in precedence)) break;

                if (
                    precedence[top] > precedence[token] ||
                    (
                        precedence[top] === precedence[token] &&
                        !rightAssociative.has(token)
                    )
                ) {
                    output.push(operators.pop());
                } else {
                    break;
                }
            }

            operators.push(token);
            expectOperand = true;

        } else if (token === "(") {
            operators.push(token);
            expectOperand = true;

        } else if (token === ")") {
            if (expectOperand) {
                throw new Error("Syntax Error: Unexpected closing parentheses");
            }

            while (
                operators.length > 0 &&
                operators.at(-1) !== "("
            ) {
                output.push(operators.pop());
            }

            if (operators.pop() !== "(") {
                throw new Error("Syntax Error: Mismatched parentheses");
            }

            expectOperand = false;

        } else if (/^[a-zA-Z_]\w*$/.test(token)) {
            if (!expectOperand) {
                throw new Error(`Syntax Error: Unexpected operand: ${token}`);
            }

            output.push("{l!" + token + "}");
            expectOperand = false;

        } else {
            throw new Error(`Syntax Error: invalid token: ${token}`);
        }
    }

    if (expectOperand) {
        throw new Error("Syntax Error: Expression ends with an operator");
    }

    while (operators.length > 0) {
        const operator = operators.pop();

        if (operator === "(") {
            throw new Error("Mismatched parentheses");
        }

        output.push(operator);
    }

    return output;
}



function parseMath(expr) {
    const mbstack = [];
    const mathstack = [];
    let tmpId = 0;

    const pexpr = infixToPostfix(expr);

    function newTemp() {
        return `l!tmp${tmpId++}`;
    }

    const operationIds = {
        "+": 12,
        "-": 13,
        "*": 14,
        "/": 15,
        "^": 40
    };

    for (const val of pexpr) {
        if (val === "u-") {
            if (mathstack.length < 1) {
                throw new Error("Missing operand for unary minus");
            }

            const operand = mathstack.pop();
            const result = newTemp();

            mbstack.push(
                examples.retObj(11, [result, "0"])
            );

            mbstack.push(
                examples.retObj(13, [result, operand])
            );

            mathstack.push(result);

        } else if (val in operationIds) {
            if (mathstack.length < 2) {
                throw new Error(
                    `Missing operand for operator "${val}"`
                );
            }

            const right = mathstack.pop();
            const left = mathstack.pop();
            const result = newTemp();

            mbstack.push(
                examples.retObj(11, [result, left])
            );

            mbstack.push(
                examples.retObj(operationIds[val], [result, right])
            );

            mathstack.push(result);

        } else {
            mathstack.push(val);
        }
    }

    if (mathstack.length !== 1) {
        throw new Error(
            `Invalid expression: expected one result, got ${mathstack.length}`
        );
    }

    return {
        actions: mbstack,
        result: mathstack.pop()
    };
}



function compile() {
    const text = document.getElementById("message").value;
    let resultt = text.replace(/"[^"\\]*(?:\\.[^"\\]*)*"|([()])/g, (match, p1) => {
        if (p1 === '(') return '( ';
        if (p1 === ')') return ' )';
        return match;
    });
    resultt = resultt.replace(
        /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--\[\[[\s\S]*?\]\]|--[^\r\n]*/g,
        match => {
            if (match.startsWith('"') || match.startsWith("'")) {
                return match;
            }

            return "";
        }
    );
    const lines = resultt.split(/\r?\n/);
    let scripts = [];
    let actions = [];
    let endstack = [];
    let functstack = [];
    let varstack = [];
    let currentEvent = null;
    let linenum = 1
    let currentFunction = null;
    const hasVar = (ident) => {
        if (ident in varstack) {
            if (varstack[ident] == "local") {
                ident = "{l!" + ident + "}";
            }
        }
        return ident;
    }

    for (const line of lines) {
        const trimmed = (line.trim()).replace(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g, "");
        const sline = trimmed.match(/"[^"]*"|\{[^}]*\}|\S+/g) || [];
        const funct = sline[0] || "";
        console.log(trimmed)

        if (trimmed.endsWith(" then") && trimmed.startsWith("when")) {
            currentEvent = trimmed.slice(5, -5).trim();
            linenum++
            endstack.push("event")
            continue;
        } else if (trimmed.endsWith(")") && trimmed.startsWith("function")) {
            const currentFunctiontmp = trimmed.slice(8, -4).trim();
            if (currentFunctiontmp == "website_loaded") {
                currentEvent = currentFunctiontmp;
                endstack.push("event")
            } else {
                currentFunction = currentFunctiontmp;
                endstack.push("function")
            }
            linenum++
            continue;
        }

        if (trimmed === "end") {
            const currentState = endstack.pop();
            if (!currentState) {
                linenum++
                throw new Error(`Syntax Error: unexpected "end" at line ${linenum}`);
            }
            if (currentState == "event") {
                scripts.push(examples.returnEventobj(currentEvent, actions))
                currentEvent = null;
                actions = [];
            } else if (currentState == "function") {
                scripts.push(examples.returnFunctionobj(currentFunction, actions, []))
                functstack.push(currentFunction)
                currentFunction = null;
                actions = [];
            } else {
                const ret = examples.retObj(25, []);
                actions.push(ret)
            }
            // Compile this line into the current function
            linenum++
            continue;
        }

        if (funct == "native_print") {
            const ret = examples.retObj(0, [sline[1]])
            actions.push(ret)
            if (sline[2]) {
                throw new Error(`Syntax Error: unexpected token "${sline[2]}" at line ${linenum}`)
            }
        } else if (funct == "local") {
            if (sline[2] !== "=") {
                throw new Error(`Syntax Error: unexpected token "${sline[2]}" at line ${linenum}`);
            }

            const expression = trimmed.slice(trimmed.indexOf("=") + 1).trim();
            const parsed = parseMath(expression);

            actions.push(...parsed.actions);

            actions.push(
                examples.retObj(11, ["l!" + sline[1], parsed.result])
            );

            varstack[sline[1]] = "local";

            if (expression === "") {
                throw new Error(`Syntax Error: missing expression at line ${linenum}`);
            }
        } else if (funct == "if") {
            if (!(sline[2] in ops)) {
                throw new Error(`Syntax Error: unexpected token "${sline[2]}" at line ${linenum}`)
            }
            const ret = examples.retObj(ops[sline[2]], [hasVar(sline[1]), hasVar(sline[3])]);
            actions.push(ret)
            endstack.push("statement")
        } else if ((funct != "") && (funct.endsWith("(")) && (sline[sline.length - 1] === ')')) {
            let sliced = funct.slice(0, -1)
            console.log(sliced);

            if (sliced == "print") {
                let ident = hasVar(sline[1]);
                const ret = examples.retObj(0, [ident])
                actions.push(ret)
            } else {
                let tv = []
                if (sline[1]) {
                    tv.push(hasVar(sline[1]));
                }
                if (sline[2]) {
                    tv.push(hasVar(sline[2]));
                }
                const ret = examples.retObj(87, [sliced], tv);
                actions.push(ret)
            }

        } else if (funct == "for") {
            if (sline[5] == "do" && sline[2] == "=") {
                const ret = examples.retObj(22, [Number(sline[4]) + 1]);
                if (sline[1] != "_") {
                    actions.push(examples.retObj(11, ["l!" + sline[1], sline[3] - 1]));
                    varstack[sline[1]] = "local"
                    actions.push(ret);
                    endstack.push("loop");
                    actions.push(examples.retObj(12, ["l!" + sline[1], 1]))
                } else {
                    actions.push(ret);
                    endstack.push("loop");
                }
            } else {
                throw new Error("Syntax Error: unknown token \"" + funct + "\" at line " + (linenum - 1));
            }
        } else if (funct != "") {
            linenum++
            throw new Error("Syntax Error: unknown token \"" + funct + "\" at line " + (linenum - 1))
        }
        linenum++
    }
    if (endstack.length > 0) {
        throw new Error(`Syntax Error: forgot to close \"then\" at line ${linenum}`);
    }
    const result = examples.returnScriptobj(scripts, scriptAlias);
    return JSON.stringify(result);
};

function safecompile() {
    const consoleBox = document.getElementById("console");
    const outputBox = document.getElementById("output");

    consoleBox.value = "";
    outputBox.value = "";

    try {
        const result = compile();
        outputBox.value = result;
        consoleBox.value = "Compilation successful. (" + new TextEncoder().encode(result).length + " bytes)";
    } catch (error) {
        console.error(error);

        let message = "Compilation failed.\n\n";

        if (error.type) {
            message += `${error.name}\n`;
        }

        if (error.line) {
            message += `Line: ${error.line}\n`;
        }

        if (error.source) {
            message += `\n${error.source}\n`;
        }

        message += `\n${error.message}`;

        consoleBox.value = message;
    }
}

button.onclick = safecompile;
button2.onclick = indentLine;
button3.onclick = changeAlias;