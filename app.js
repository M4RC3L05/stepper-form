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

function onNavigate(newStep) {
    if (newStep < 0 || newStep >= state.totalSteps) return;

    let lastStep = state.currStep;
    state.currStep = newStep;

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

function unbindEventsFromStage(stage) {
    const previousBtn = getPreviousBtnFromStage(stage);

    if (previousBtn) previousBtn.removeEventListener("click", onStepPrev);

    const next = getNextBtnFromStage(stage);

    if (next) next.removeEventListener("click", onStepNext);

    const done = getAllDoneBtnFromStage(stage);

    if (done) done.removeEventListener("click", onStepNext);
}

function bindEventsForStage(stage) {
    const previousBtn = getPreviousBtnFromStage(stage);

    if (previousBtn) previousBtn.addEventListener("click", onStepPrev);

    const next = getNextBtnFromStage(stage);

    if (next) next.addEventListener("click", onStepNext);

    const done = getAllDoneBtnFromStage(stage);

    if (done) done.addEventListener("click", onResetStep);
}

function getPreviousBtnFromStage(stage) {
    return stage.querySelector("button.stepper_form__action--previous");
}

function getAllDoneBtnFromStage(stage) {
    return stage.querySelector("button.stepper_form__action--done");
}

function getNextBtnFromStage(stage) {
    return stage.querySelector("button.stepper_form__action--next");
}

function onStepNext() {
    onNavigate(state.currStep + 1);
}

function onStepPrev() {
    onNavigate(state.currStep - 1);
}

function onResetStep() {
    onNavigate(0);
}

function performStepTransition(currStep, nextStep, shouldDefere = true) {
    hideStep(currStep);
    if (shouldDefere)
        state.transitionTimeout = setTimeout(() => {
            showStep(nextStep);
        }, 400);
    else showStep(nextStep);
}

function hideStep(domStep) {
    domStep.classList.remove("show");
}

function showStep(domStep) {
    domStep.classList.add("show");
}

document.addEventListener("DOMContentLoaded", () => {
    state.totalSteps = DOM.steps.length;
    onNavigate(0);
    DOM.steps[state.currStep]
        .querySelector("button")
        .addEventListener("click", e => console.log("jjj"));
});
