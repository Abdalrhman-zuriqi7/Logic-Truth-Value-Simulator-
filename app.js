/* =========================================================
   LOGIC & TRUTH VALUE SIMULATOR
   Application Controller

   Responsibilities:
   1. DOM interaction
   2. Formula analysis
   3. Truth table rendering
   4. Equivalence checking
   5. Formula builder
   6. Theme switching
   7. CSV export
   8. Keyboard shortcuts
========================================================= */

/* =========================================================
   DOM ELEMENTS
========================================================= */

const formulaInput =
    document.getElementById(
        "formulaInput"
    );

const analyzeButton =
    document.getElementById(
        "analyzeButton"
    );

const resetButton =
    document.getElementById(
        "resetButton"
    );

const clearFormula =
    document.getElementById(
        "clearFormula"
    );

const errorBox =
    document.getElementById(
        "errorBox"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );

const resultsSection =
    document.getElementById(
        "resultsSection"
    );

const truthTableSection =
    document.getElementById(
        "truthTableSection"
    );

const processSection =
    document.getElementById(
        "processSection"
    );

const classificationResult =
    document.getElementById(
        "classificationResult"
    );

const classificationDescription =
    document.getElementById(
        "classificationDescription"
    );

const variableCount =
    document.getElementById(
        "variableCount"
    );

const variableList =
    document.getElementById(
        "variableList"
    );

const caseCount =
    document.getElementById(
        "caseCount"
    );

const truthStatistics =
    document.getElementById(
        "truthStatistics"
    );

const formattedFormula =
    document.getElementById(
        "formattedFormula"
    );

const humanExplanation =
    document.getElementById(
        "humanExplanation"
    );

const truthTableHead =
    document.getElementById(
        "truthTableHead"
    );

const truthTableBody =
    document.getElementById(
        "truthTableBody"
    );

const tableVariableInfo =
    document.getElementById(
        "tableVariableInfo"
    );

const exportTableButton =
    document.getElementById(
        "exportTableButton"
    );

const copyFormulaButton =
    document.getElementById(
        "copyFormulaButton"
    );

const formulaA =
    document.getElementById(
        "formulaA"
    );

const formulaB =
    document.getElementById(
        "formulaB"
    );

const checkEquivalenceButton =
    document.getElementById(
        "checkEquivalenceButton"
    );

const equivalenceResult =
    document.getElementById(
        "equivalenceResult"
    );

const equivalenceStatus =
    document.getElementById(
        "equivalenceStatus"
    );

const equivalenceExplanation =
    document.getElementById(
        "equivalenceExplanation"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

/* =========================================================
   APPLICATION STATE
========================================================= */

let currentAnalysis = null;

let currentEquivalence = null;

/* =========================================================
   ANALYZE FORMULA
========================================================= */

function handleAnalyze() {

    hideError();

    const input =
        formulaInput.value.trim();

    if (!input) {

        showError(
            "Please enter a logical formula first."
        );

        return;
    }

    try {

        const analysis =
            LogicEngine.analyzeFormula(
                input
            );

        currentAnalysis =
            analysis;

        renderAnalysis(
            analysis
        );

        renderTruthTable(
            analysis
        );

        showAnalysisSections();

        /*
            Scroll gently to the results.
        */

        setTimeout(() => {

            resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }

    catch (error) {

        showError(
            error.message
        );
    }
}

/* =========================================================
   RENDER ANALYSIS
========================================================= */

function renderAnalysis(
    analysis
) {

    classificationResult.textContent =
        formatClassification(
            analysis.classification
        );

    classificationResult.className =
        "classification " +
        analysis.classification.toLowerCase();

    classificationDescription.textContent =
        getClassificationShortDescription(
            analysis.classification
        );

    variableCount.textContent =
        analysis.variables.length;

    variableList.textContent =
        analysis.variables.length > 0
            ? analysis.variables.join(", ")
            : "No variables";

    caseCount.textContent =
        analysis.statistics.total;

    truthStatistics.textContent =
        `${analysis.statistics.trueCount} / ${analysis.statistics.falseCount}`;

    formattedFormula.textContent =
        analysis.formatted;

    humanExplanation.textContent =
        LogicEngine.createExplanation(
            analysis
        );

    tableVariableInfo.textContent =
        `${analysis.variables.length} variable${analysis.variables.length === 1 ? "" : "s"} · ${analysis.statistics.total} possible assignment${analysis.statistics.total === 1 ? "" : "s"}`;
}

/* =========================================================
   CLASSIFICATION TEXT
========================================================= */

function formatClassification(
    classification
) {

    switch (
        classification
    ) {

        case "TAUTOLOGY":

            return "Tautology";

        case "CONTRADICTION":

            return "Contradiction";

        case "CONTINGENT":

            return "Contingent";

        default:

            return classification;
    }
}

function getClassificationShortDescription(
    classification
) {

    switch (
        classification
    ) {

        case "TAUTOLOGY":

            return "Always true";

        case "CONTRADICTION":

            return "Always false";

        case "CONTINGENT":

            return "Sometimes true, sometimes false";

        default:

            return "";
    }
}

/* =========================================================
   SHOW RESULT SECTIONS
========================================================= */

function showAnalysisSections() {

    resultsSection.classList.remove(
        "hidden"
    );

    truthTableSection.classList.remove(
        "hidden"
    );

    processSection.classList.remove(
        "hidden"
    );
}

/* =========================================================
   TRUTH TABLE
========================================================= */

function renderTruthTable(
    analysis
) {

    truthTableHead.innerHTML =
        "";

    truthTableBody.innerHTML =
        "";

    /*
        Header row
    */

    const headerRow =
        document.createElement(
            "tr"
        );

    for (
        const variable of analysis.variables
    ) {

        const th =
            document.createElement(
                "th"
            );

        th.textContent =
            variable;

        headerRow.appendChild(
            th
        );
    }

    /*
        Subexpressions
    */

    for (
        const expression of analysis.table.subexpressions
    ) {

        const th =
            document.createElement(
                "th"
            );

        th.textContent =
            expression;

        headerRow.appendChild(
            th
        );
    }

    /*
        Final result
    */

    const finalHeader =
        document.createElement(
            "th"
        );

    finalHeader.textContent =
        "RESULT";

    finalHeader.classList.add(
        "final-column"
    );

    headerRow.appendChild(
        finalHeader
    );

    truthTableHead.appendChild(
        headerRow
    );

    /*
        Rows
    */

    analysis.table.rows.forEach(
        (row, rowIndex) => {

            const tr =
                document.createElement(
                    "tr"
                );

            /*
                Variables
            */

            for (
                const variable of analysis.variables
            ) {

                const td =
                    document.createElement(
                        "td"
                    );

                const value =
                    row.assignment[
                        variable
                    ];

                td.textContent =
                    value
                        ? "T"
                        : "F";

                td.classList.add(
                    value
                        ? "truth-true"
                        : "truth-false"
                );

                tr.appendChild(
                    td
                );
            }

            /*
                Subexpressions
            */

            for (
                const expression of analysis.table.subexpressions
            ) {

                const td =
                    document.createElement(
                        "td"
                    );

                const value =
                    row.steps[
                        expression
                    ];

                td.textContent =
                    value
                        ? "T"
                        : "F";

                td.classList.add(
                    value
                        ? "truth-true"
                        : "truth-false"
                );

                tr.appendChild(
                    td
                );
            }

            /*
                Final result
            */

            const finalTd =
                document.createElement(
                    "td"
                );

            finalTd.textContent =
                row.result
                    ? "T"
                    : "F";

            finalTd.classList.add(
                "final-column"
            );

            finalTd.classList.add(
                row.result
                    ? "truth-true"
                    : "truth-false"
            );

            tr.appendChild(
                finalTd
            );

            /*
                Small row animation delay
            */

            tr.style.animation =
                `tableRowAppear 200ms ease ${rowIndex * 10}ms both`;

            truthTableBody.appendChild(
                tr
            );

        }
    );
}

/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(
    message
) {

    errorMessage.textContent =
        message;

    errorBox.classList.remove(
        "hidden"
    );
}

function hideError() {

    errorBox.classList.add(
        "hidden"
    );

    errorMessage.textContent =
        "";
}

/* =========================================================
   RESET
========================================================= */

function resetApplication() {

    formulaInput.value =
        "(P ^ Q) -> P";

    formulaA.value =
        "";

    formulaB.value =
        "";

    currentAnalysis =
        null;

    currentEquivalence =
        null;

    hideError();

    resultsSection.classList.add(
        "hidden"
    );

    truthTableSection.classList.add(
        "hidden"
    );

    processSection.classList.add(
        "hidden"
    );

    equivalenceResult.classList.add(
        "hidden"
    );

    truthTableHead.innerHTML =
        "";

    truthTableBody.innerHTML =
        "";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}

/* =========================================================
   CLEAR FORMULA
========================================================= */

function clearFormulaInput() {

    formulaInput.value = "";

    formulaInput.focus();
}

/* =========================================================
   FORMULA BUILDER
========================================================= */

function insertAtCursor(
    input,
    text
) {

    const start =
        input.selectionStart;

    const end =
        input.selectionEnd;

    const currentValue =
        input.value;

    input.value =
        currentValue.slice(
            0,
            start
        ) +
        text +
        currentValue.slice(
            end
        );

    const newPosition =
        start +
        text.length;

    input.focus();

    input.setSelectionRange(
        newPosition,
        newPosition
    );
}

function setupFormulaBuilder() {

    const keys =
        document.querySelectorAll(
            ".logic-key"
        );

    keys.forEach(
        key => {

            key.addEventListener(
                "click",
                () => {

                    const value =
                        key.dataset.insert;

                    insertAtCursor(
                        formulaInput,
                        value
                    );
                }
            );

        }
    );
}

/* =========================================================
   EXAMPLES
========================================================= */

function setupExamples() {

    const buttons =
        document.querySelectorAll(
            ".example-button"
        );

    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const example =
                        button.dataset.example;

                    formulaInput.value =
                        example;

                    formulaInput.focus();
                }
            );

        }
    );
}

/* =========================================================
   EQUIVALENCE CHECKER
========================================================= */

function handleEquivalenceCheck() {

    equivalenceResult.classList.add(
        "hidden"
    );

    const inputA =
        formulaA.value.trim();

    const inputB =
        formulaB.value.trim();

    if (!inputA) {

        showError(
            "Please enter Formula A."
        );

        return;
    }

    if (!inputB) {

        showError(
            "Please enter Formula B."
        );

        return;
    }

    hideError();

    try {

        const result =
            LogicEngine.checkLogicalEquivalence(
                inputA,
                inputB
            );

        currentEquivalence =
            result;

        renderEquivalenceResult(
            result
        );

    }

    catch (error) {

        showError(
            error.message
        );
    }
}

/* =========================================================
   RENDER EQUIVALENCE
========================================================= */

function renderEquivalenceResult(
    result
) {

    equivalenceResult.classList.remove(
        "hidden"
    );

    if (
        result.equivalent
    ) {

        equivalenceStatus.textContent =
            "✓ Logically Equivalent";

        equivalenceStatus.className =
            "equivalence-status equivalent";

        equivalenceExplanation.textContent =
            `The formulas "${result.formattedA}" and "${result.formattedB}" produce exactly the same truth value for every possible assignment of ${result.variables.join(", ")}. Therefore, they are logically equivalent.`;

    }

    else {

        const counterexample =
            result.rows.find(
                row => !row.same
            );

        equivalenceStatus.textContent =
            "✕ Not Equivalent";

        equivalenceStatus.className =
            "equivalence-status not-equivalent";

        let counterexampleText =
            "";

        if (
            counterexample
        ) {

            const assignmentText =
                result.variables
                    .map(
                        variable =>
                            `${variable}=${counterexample.assignment[variable] ? "T" : "F"}`
                    )
                    .join(", ");

            counterexampleText =
                ` A counterexample is ${assignmentText}: Formula A is ${counterexample.valueA ? "T" : "F"} while Formula B is ${counterexample.valueB ? "T" : "F"}.`;
        }

        equivalenceExplanation.textContent =
            `The formulas do not have the same truth value for every possible assignment.${counterexampleText}`;
    }
}

/* =========================================================
   COPY FORMULA
========================================================= */

async function copyFormula() {

    if (
        !currentAnalysis
    ) {

        return;
    }

    const text =
        currentAnalysis.formatted;

    try {

        await navigator.clipboard.writeText(
            text
        );

        const originalText =
            copyFormulaButton.textContent;

        copyFormulaButton.textContent =
            "Copied ✓";

        setTimeout(
            () => {

                copyFormulaButton.textContent =
                    originalText;

            },
            1200
        );

    }

    catch {

        showError(
            "The browser did not allow copying to the clipboard."
        );
    }
}

/* =========================================================
   EXPORT CSV
========================================================= */

function exportTruthTable() {

    if (
        !currentAnalysis
    ) {

        showError(
            "Analyze a formula before exporting the table."
        );

        return;
    }

    const analysis =
        currentAnalysis;

    const headers = [

        ...analysis.variables,

        ...analysis.table.subexpressions,

        "RESULT"

    ];

    const csvRows = [

        headers

    ];

    analysis.table.rows.forEach(
        row => {

            const values = [];

            /*
                Variables
            */

            analysis.variables.forEach(
                variable => {

                    values.push(
                        row.assignment[variable]
                            ? "T"
                            : "F"
                    );
                }
            );

            /*
                Subexpressions
            */

            analysis.table.subexpressions.forEach(
                expression => {

                    values.push(
                        row.steps[expression]
                            ? "T"
                            : "F"
                    );
                }
            );

            /*
                Final
            */

            values.push(
                row.result
                    ? "T"
                    : "F"
            );

            csvRows.push(
                values
            );

        }
    );

    const csv =
        csvRows
            .map(
                row =>
                    row
                        .map(
                            value =>
                                `"${String(value).replaceAll('"', '""')}"`
                        )
                        .join(",")
            )
            .join("\n");

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "truth-table.csv";

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );
}

/* =========================================================
   THEME
========================================================= */

function setupTheme() {

    const savedTheme =
        localStorage.getItem(
            "logic-theme"
        );

    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );

        themeToggle.textContent =
            "☾";

    }

    else {

        themeToggle.textContent =
            "☀";
    }

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-theme"
            );

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );

            localStorage.setItem(
                "logic-theme",
                isLight
                    ? "light"
                    : "dark"
            );

            themeToggle.textContent =
                isLight
                    ? "☾"
                    : "☀";
        }
    );
}

/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboardShortcuts() {

    formulaInput.addEventListener(
        "keydown",
        event => {

            /*
                Ctrl + Enter
                Analyze formula
            */

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                handleAnalyze();
            }

            /*
                Escape
                Clear current input
            */

            if (
                event.key === "Escape"
            ) {

                formulaInput.value = "";

            }

        }
    );

    document.addEventListener(
        "keydown",
        event => {

            /*
                Ctrl + Shift + E
                Equivalence check
            */

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() === "e"
            ) {

                event.preventDefault();

                handleEquivalenceCheck();
            }

        }
    );
}

/* =========================================================
   EVENT LISTENERS
========================================================= */

analyzeButton.addEventListener(
    "click",
    handleAnalyze
);

resetButton.addEventListener(
    "click",
    resetApplication
);

clearFormula.addEventListener(
    "click",
    clearFormulaInput
);

checkEquivalenceButton.addEventListener(
    "click",
    handleEquivalenceCheck
);

copyFormulaButton.addEventListener(
    "click",
    copyFormula
);

exportTableButton.addEventListener(
    "click",
    exportTruthTable
);

/* =========================================================
   INITIALIZATION
========================================================= */

setupFormulaBuilder();

setupExamples();

setupTheme();

setupKeyboardShortcuts();

/*
    Automatically analyze the default example
    after the page loads.
*/

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                handleAnalyze();

            },
            200
        );
    }
);