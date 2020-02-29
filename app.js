const state = {
    currStep: 0,
    totalSteps: 3,
    hasPeformStepTransition: false,
    transitionTimeout: undefined
};

const DOM = {
    stepper_form: document.querySelector(".stepper_form"),
    steps: Array.from(document.querySelector(".stepper_form").children)
};

/**
 *
 * Updates the current step, clears previous stage event listeners,
 * sets up next stage event listeners and bootstraps the stage
 * transition
 *
 * @param {Number} nextStage the next stage position to nativate
 *
 */
function onNavigate(nextStage) {
    if (nextStage < 0 || nextStage >= state.totalSteps) return;

    let lastStep = state.currStep;
    state.currStep = nextStage;

    if (state.transitionTimeout) clearTimeout(state.transitionTimeout);

    unbindEventsFromStage(DOM.steps[lastStep]);
    bindEventsForStage(DOM.steps[state.currStep]);

    performStepTransition(
        DOM.steps[lastStep],
        DOM.steps[state.currStep],
        state.hasPeformStepTransition
    );

    state.hasPeformStepTransition = true;
}

/**
 *
 * Navigates to the next stage
 *
 */
function onStepNext() {
    onNavigate(state.currStep + 1);
}

/**
 *
 * Navigates to the previous stage
 *
 */
function onStepPrev() {
    onNavigate(state.currStep - 1);
}

/**
 *
 * Navigates to the begining
 *
 */
function onResetStep() {
    onNavigate(0);
}

/**
 *
 * Performs the transition between stages.
 *
 * @param {HTMLElement} previousStage The previous stage dom element
 * @param {HTMLElement} nextStage The next stage dom element
 * @param {boolean} [shouldDefer] Indicates if the transitions between stages should have delay
 *
 */
function performStepTransition(previousStage, nextStage, shouldDefer = true) {
    hideStep(previousStage);

    if (!shouldDefer) {
        showStep(nextStage);
        return;
    }

    state.transitionTimeout = setTimeout(() => {
        showStep(nextStage);
    }, 400);
}

/**
 *
 * Clears all event listeners from stage
 *
 * @param {HTMLElement} stage the stage dom element
 *
 */
function unbindEventsFromStage(stage) {
    const previousBtn = getPreviousBtnFromStage(stage);

    if (previousBtn) previousBtn.removeEventListener("click", onStepPrev);

    const next = getNextBtnFromStage(stage);

    if (next) next.removeEventListener("click", onStepNext);

    const done = getAllDoneBtnFromStage(stage);

    if (done) done.removeEventListener("click", onStepNext);
}

/**
 *
 * Sets up all event listeners for the stage
 *
 * @param {HTMLElement} stage the stage dom element
 *
 */
function bindEventsForStage(stage) {
    const previousBtn = getPreviousBtnFromStage(stage);

    if (previousBtn) previousBtn.addEventListener("click", onStepPrev);

    const next = getNextBtnFromStage(stage);

    if (next) next.addEventListener("click", onStepNext);

    const done = getAllDoneBtnFromStage(stage);

    if (done) done.addEventListener("click", onResetStep);
}

/**
 *
 * Generic function to fetch a button fro a stage by the type
 *
 * @param {string} type The button type
 * @returns {(stage: HTMLElement) => HTMLButtonElement}
 *
 */
function getButtonFromStage(type) {
    return stage => stage.querySelector(`button.stepper_form__action--${type}`);
}

/**
 *
 * Gets the previous button from stage
 *
 * @type {(stage: HTMLElement) => HTMLButtonElement}
 *
 */
const getPreviousBtnFromStage = getButtonFromStage("previous");
/**
 *
 * Gets the previous button from stage
 *
 * @type {(stage: HTMLElement) => HTMLButtonElement}
 *
 */
const getNextBtnFromStage = getButtonFromStage("next");
/**
 *
 * Gets the previous button from stage
 *
 * @type {(stage: HTMLElement) => HTMLButtonElement}
 *
 */
const getAllDoneBtnFromStage = getButtonFromStage("done");

/**
 *
 * Hides a stage
 *
 * @param {HTMLElement} stage The stage dom element
 *
 */
function hideStep(stage) {
    stage.classList.remove("show");
}

/**
 *
 * Reveals a stage
 *
 * @param {HTMLElement} stage  The stage dom element
 *
 */
function showStep(stage) {
    stage.classList.add("show");
}

document.addEventListener("DOMContentLoaded", () => {
    state.totalSteps = DOM.steps.length;
    onNavigate(0);
});
