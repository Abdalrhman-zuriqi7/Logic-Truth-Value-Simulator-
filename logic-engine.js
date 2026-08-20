/* =========================================================
   LOGIC & TRUTH VALUE SIMULATOR
   Logic Evaluation Engine

   Responsibilities:
   1. AST evaluation
   2. Sub-expression extraction
   3. Truth table generation
   4. Tautology / contradiction / contingency
   5. Logical equivalence
   6. Human-readable explanations
========================================================= */

/* =========================================================
   EVALUATE AST
========================================================= */

function evaluateAST(node, assignment) {

    if (
        node.type === "VARIABLE"
    ) {

        return Boolean(
            assignment[node.name]
        );
    }

    if (
        node.type === "UNARY"
    ) {

        const operand =
            evaluateAST(
                node.operand,
                assignment
            );

        if (
            node.operator === "NOT"
        ) {

            return !operand;
        }
    }

    if (
        node.type === "BINARY"
    ) {

        const left =
            evaluateAST(
                node.left,
                assignment
            );

        const right =
            evaluateAST(
                node.right,
                assignment
            );

        switch (
            node.operator
        ) {

            case "AND":

                return left && right;

            case "OR":

                return left || right;

            case "IMPLIES":

                return !left || right;

            case "IFF":

                return left === right;

            default:

                throw new Error(
                    `Unknown operator: ${node.operator}`
                );
        }
    }

    throw new Error(
        "Invalid AST node."
    );
}

/* =========================================================
   GET SUBEXPRESSIONS
========================================================= */

function getSubexpressions(node, list = []) {

    if (
        node.type === "VARIABLE"
    ) {

        return list;
    }

    if (
        node.type === "UNARY"
    ) {

        getSubexpressions(
            node.operand,
            list
        );

        const representation =
            LogicParserAPI.astToString(node);

        if (
            !list.includes(representation)
        ) {

            list.push(
                representation
            );
        }

        return list;
    }

    if (
        node.type === "BINARY"
    ) {

        getSubexpressions(
            node.left,
            list
        );

        getSubexpressions(
            node.right,
            list
        );

        const representation =
            LogicParserAPI.astToString(node);

        if (
            !list.includes(representation)
        ) {

            list.push(
                representation
            );
        }
    }

    return list;
}

/* =========================================================
   GENERATE TRUTH ASSIGNMENTS
========================================================= */

function generateAssignments(variables) {

    const count =
        variables.length;

    const rows =
        Math.pow(2, count);

    const assignments = [];

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        const assignment = {};

        for (
            let index = 0;
            index < count;
            index++
        ) {

            /*
                Binary counting.

                Example with P,Q:

                00
                01
                10
                11
            */

            const bit =
                (row >>
                    (count - index - 1)
                ) & 1;

            assignment[
                variables[index]
            ] =
                bit === 1;
        }

        assignments.push(
            assignment
        );
    }

    return assignments;
}

/* =========================================================
   EVALUATE SUBEXPRESSIONS
========================================================= */

function evaluateSubexpressions(
    node,
    assignment,
    results = {}
) {

    if (
        node.type === "VARIABLE"
    ) {

        return evaluateAST(
            node,
            assignment
        );
    }

    if (
        node.type === "UNARY"
    ) {

        const operand =
            evaluateSubexpressions(
                node.operand,
                assignment,
                results
            );

        let value;

        if (
            node.operator === "NOT"
        ) {

            value =
                !operand;
        }

        const key =
            LogicParserAPI.astToString(node);

        results[key] =
            value;

        return value;
    }

    if (
        node.type === "BINARY"
    ) {

        const left =
            evaluateSubexpressions(
                node.left,
                assignment,
                results
            );

        const right =
            evaluateSubexpressions(
                node.right,
                assignment,
                results
            );

        let value;

        switch (
            node.operator
        ) {

            case "AND":

                value =
                    left && right;

                break;

            case "OR":

                value =
                    left || right;

                break;

            case "IMPLIES":

                value =
                    !left || right;

                break;

            case "IFF":

                value =
                    left === right;

                break;

            default:

                throw new Error(
                    `Unknown operator: ${node.operator}`
                );
        }

        const key =
            LogicParserAPI.astToString(node);

        results[key] =
            value;

        return value;
    }

    throw new Error(
        "Invalid AST node."
    );
}

/* =========================================================
   BUILD TRUTH TABLE
========================================================= */

function generateTruthTable(
    ast,
    variables
) {

    const assignments =
        generateAssignments(
            variables
        );

    const rows = [];

    for (
        const assignment of assignments
    ) {

        const steps = {};

        const finalValue =
            evaluateSubexpressions(
                ast,
                assignment,
                steps
            );

        rows.push({

            assignment,

            steps,

            result: finalValue

        });
    }

    return {

        variables,

        rows,

        subexpressions:
            getSubexpressions(ast)

    };
}

/* =========================================================
   CLASSIFICATION
========================================================= */

function classifyResults(rows) {

    const values =
        rows.map(
            row => row.result
        );

    const allTrue =
        values.every(
            Boolean
        );

    const allFalse =
        values.every(
            value => !value
        );

    if (allTrue) {

        return "TAUTOLOGY";
    }

    if (allFalse) {

        return "CONTRADICTION";
    }

    return "CONTINGENT";
}

/* =========================================================
   STATISTICS
========================================================= */

function calculateStatistics(rows) {

    const trueCount =
        rows.filter(
            row => row.result
        ).length;

    const falseCount =
        rows.length -
        trueCount;

    return {

        trueCount,

        falseCount,

        total:
            rows.length

    };
}

/* =========================================================
   ANALYZE FORMULA
========================================================= */

function analyzeFormula(input) {

    const parsed =
        LogicParserAPI.parseFormula(
            input
        );

    const variables =
        Array.from(
            LogicParserAPI.collectVariables(
                parsed.ast
            )
        ).sort();

    const table =
        generateTruthTable(
            parsed.ast,
            variables
        );

    const classification =
        classifyResults(
            table.rows
        );

    const statistics =
        calculateStatistics(
            table.rows
        );

    return {

        input:
            parsed.input,

        ast:
            parsed.ast,

        formatted:
            LogicParserAPI.astToString(
                parsed.ast
            ),

        variables,

        table,

        classification,

        statistics

    };
}

/* =========================================================
   LOGICAL EQUIVALENCE
========================================================= */

function checkLogicalEquivalence(
    formulaA,
    formulaB
) {

    const parsedA =
        LogicParserAPI.parseFormula(
            formulaA
        );

    const parsedB =
        LogicParserAPI.parseFormula(
            formulaB
        );

    const variables =
        Array.from(
            new Set([

                ...LogicParserAPI.collectVariables(
                    parsedA.ast
                ),

                ...LogicParserAPI.collectVariables(
                    parsedB.ast
                )

            ])
        ).sort();

    const assignments =
        generateAssignments(
            variables
        );

    const rows = [];

    let equivalent = true;

    for (
        const assignment of assignments
    ) {

        const valueA =
            evaluateAST(
                parsedA.ast,
                assignment
            );

        const valueB =
            evaluateAST(
                parsedB.ast,
                assignment
            );

        const same =
            valueA === valueB;

        if (!same) {

            equivalent = false;
        }

        rows.push({

            assignment,

            valueA,

            valueB,

            same

        });
    }

    return {

        formulaA:
            parsedA.input,

        formulaB:
            parsedB.input,

        formattedA:
            LogicParserAPI.astToString(
                parsedA.ast
            ),

        formattedB:
            LogicParserAPI.astToString(
                parsedB.ast
            ),

        variables,

        rows,

        equivalent

    };
}

/* =========================================================
   HUMAN EXPLANATION
========================================================= */

function createExplanation(
    analysis
) {

    const {
        classification,
        variables,
        statistics,
        formatted
    } = analysis;

    const variableText =
        variables.length === 1
            ? `The formula contains one logical variable: ${variables[0]}.`
            : `The formula contains ${variables.length} logical variables: ${variables.join(", ")}.`;

    const casesText =
        `Because there are ${variables.length} variable${variables.length === 1 ? "" : "s"}, the simulator checks ${statistics.total} possible combination${statistics.total === 1 ? "" : "s"} of truth values.`;

    let classificationText;

    if (
        classification === "TAUTOLOGY"
    ) {

        classificationText =
            `Every possible assignment makes "${formatted}" true. Therefore, the proposition is a tautology — it is logically true regardless of the values assigned to its variables.`;
    }

    else if (
        classification === "CONTRADICTION"
    ) {

        classificationText =
            `Every possible assignment makes "${formatted}" false. Therefore, the proposition is a contradiction — it can never be true.`;
    }

    else {

        classificationText =
            `Some assignments make "${formatted}" true while others make it false. Therefore, the proposition is contingent — its truth depends on the values of its variables.`;
    }

    return `${variableText} ${casesText} ${classificationText} The table contains ${statistics.trueCount} true case${statistics.trueCount === 1 ? "" : "s"} and ${statistics.falseCount} false case${statistics.falseCount === 1 ? "" : "s"}.`;
}

/* =========================================================
   OPERATOR EXPLANATIONS
========================================================= */

function explainOperator(operator) {

    const explanations = {

        NOT:
            "NOT reverses the truth value. If P is true, NOT P is false; if P is false, NOT P is true.",

        AND:
            "AND is true only when both sides are true.",

        OR:
            "OR is true when at least one side is true.",

        IMPLIES:
            "Implication P → Q is false only when P is true and Q is false.",

        IFF:
            "A biconditional P ↔ Q is true when both sides have the same truth value."

    };

    return (
        explanations[operator] ||
        "Unknown logical operator."
    );
}

/* =========================================================
   EXPORT
========================================================= */

window.LogicEngine = {

    evaluateAST,

    getSubexpressions,

    generateAssignments,

    generateTruthTable,

    classifyResults,

    calculateStatistics,

    analyzeFormula,

    checkLogicalEquivalence,

    createExplanation,

    explainOperator

};