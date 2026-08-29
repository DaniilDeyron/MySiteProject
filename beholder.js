/* =========================================================
   БЕХОЛДЕР — ИНТЕРАКТИВНОСТЬ
   Пути к изображениям соответствуют твоим названиям файлов.
   ========================================================= */

const stage = document.getElementById("stage");
const beholder = document.getElementById("beholder");
const orbit = document.getElementById("orbit");
const baseBody = document.getElementById("baseBody");
const readingBody = document.getElementById("readingBody");
const storiesBody = document.getElementById("storiesBody");
const storyLaunch = document.getElementById("storyLaunch");
const detail = document.getElementById("detail");
const cursorOrb = document.getElementById("cursorOrb");
const stateTitle = document.getElementById("stateTitle");
const stateText = document.getElementById("stateText");

const eyes = [
    ...document.querySelectorAll(".eye-slot")
];

const nodes = [
    ...document.querySelectorAll(".node")
];


/* =========================================================
   ИЗОБРАЖЕНИЯ
   ========================================================= */

baseBody.src =
    "assets/beholder/beholder_base.png";

readingBody.src =
    "assets/beholder/beholder_reading.png";

storiesBody.src =
    "assets/beholder/beholder_rage.png";


/* =========================================================
   КУРСОР
   ========================================================= */

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

let smoothX =
    mouseX;

let smoothY =
    mouseY;


if (cursorOrb) {

    document.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            cursorOrb.style.left =
                `${mouseX}px`;

            cursorOrb.style.top =
                `${mouseY}px`;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   ГЛАЗА
   ========================================================= */

const eyeState =
    eyes.map(
        () => ({
            x: 0,
            y: 0
        })
    );


function animateEyes() {

    smoothX +=
        (
            mouseX -
            smoothX
        ) * 0.18;


    smoothY +=
        (
            mouseY -
            smoothY
        ) * 0.18;


    const isIdle =
        !stage.classList.contains(
            "reading"
        ) &&
        !stage.classList.contains(
            "stories"
        );


    if (isIdle) {

        eyes.forEach(
            (eye, index) => {

                const rect =
                    eye.getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                const dx =
                    smoothX -
                    centerX;


                const dy =
                    smoothY -
                    centerY;


                const distance =
                    Math.hypot(
                        dx,
                        dy
                    ) || 1;


                const maxMove =
                    rect.width * 0.12;


                const factor =
                    Math.min(
                        maxMove /
                        distance,
                        1
                    );


                const desiredX =
                    dx * factor;


                const desiredY =
                    dy * factor;


                const speed =
                    0.19 +
                    (
                        index % 3
                    ) * 0.035;


                eyeState[index].x +=
                    (
                        desiredX -
                        eyeState[index].x
                    ) * speed;


                eyeState[index].y +=
                    (
                        desiredY -
                        eyeState[index].y
                    ) * speed;


                const image =
                    eye.querySelector(
                        ".eye-image"
                    );


                if (image) {

                    image.style.transform =
                        `
                        translate(
                            calc(
                                -50% +
                                ${eyeState[index].x}px
                            ),
                            calc(
                                -50% +
                                ${eyeState[index].y}px
                            )
                        )
                        `;

                }

            }
        );

    }


    requestAnimationFrame(
        animateEyes
    );

}


requestAnimationFrame(
    animateEyes
);


/* =========================================================
   КООРДИНАТЫ ВКЛАДОК
   ========================================================= */

nodes.forEach(
    (node) => {

        node.dataset.baseX =
            parseFloat(
                getComputedStyle(node)
                    .getPropertyValue(
                        "--base-x"
                    )
            ) || 0;


        node.dataset.baseY =
            parseFloat(
                getComputedStyle(node)
                    .getPropertyValue(
                        "--base-y"
                    )
            ) || 0;

    }
);


/* =========================================================
   ЖИВОЕ ДВИЖЕНИЕ ВКЛАДОК
   ========================================================= */

let stageMouseX = 0;
let stageMouseY = 0;
let stageHasPointer = false;


stage.addEventListener(
    "mousemove",
    (event) => {

        const rect =
            stage.getBoundingClientRect();


        stageMouseX =
            event.clientX -
            rect.left -
            rect.width / 2;


        stageMouseY =
            event.clientY -
            rect.top -
            rect.height / 2;


        stageHasPointer = true;

    }
);


stage.addEventListener(
    "mouseleave",
    () => {

        stageHasPointer = false;

        stageMouseX = 0;
        stageMouseY = 0;

    }
);


function animateNodes(time) {

    const seconds =
        time / 1000;


    nodes.forEach(
        (node, index) => {

            if (
                node.classList.contains(
                    "active"
                )
            ) {
                return;
            }


            const baseX =
                Number(
                    node.dataset.baseX
                );


            const baseY =
                Number(
                    node.dataset.baseY
                );


            const angle =
                Math.atan2(
                    baseY,
                    baseX
                );


            const speed =
                0.72 +
                index * 0.055;


            const phase =
                index * 1.37;


            const idle =
                Math.sin(
                    seconds *
                    speed +
                    phase
                ) *
                (
                    9 +
                    (
                        index % 3
                    ) * 2.5
                );


            const secondary =
                Math.sin(
                    seconds *
                    speed *
                    1.73 +
                    phase *
                    0.63
                ) * 2.8;


            let pointerTangent = 0;


            if (stageHasPointer) {

                pointerTangent =
                    Math.max(
                        -28,
                        Math.min(
                            28,
                            stageMouseY / 12
                        )
                    ) *
                    (
                        0.20 +
                        index * 0.012
                    );

            }


            const tangent =
                idle +
                secondary +
                pointerTangent;


            const x =
                baseX -
                Math.sin(angle) *
                tangent;


            const y =
                baseY +
                Math.cos(angle) *
                tangent;


            node.style.setProperty(
                "--x",
                `${x.toFixed(2)}px`
            );


            node.style.setProperty(
                "--y",
                `${y.toFixed(2)}px`
            );

        }
    );


    requestAnimationFrame(
        animateNodes
    );

}


requestAnimationFrame(
    animateNodes
);


/* =========================================================
   ПОЗИЦИЯ СВОДКИ
   ========================================================= */

function positionDetail(node) {

    const rect =
        stage.getBoundingClientRect();


    const cx =
        rect.width / 2;


    const cy =
        rect.height / 2;


    const x =
        parseFloat(
            node.style.getPropertyValue(
                "--x"
            )
        ) ||
        Number(
            node.dataset.baseX
        );


    const y =
        parseFloat(
            node.style.getPropertyValue(
                "--y"
            )
        ) ||
        Number(
            node.dataset.baseY
        );


    const nw =
        node.offsetWidth;


    const nh =
        node.offsetHeight;


    const dw =
        detail.offsetWidth;


    const dh =
        detail.offsetHeight;


    let left;
    let top;


    if (y < -110) {

        left =
            cx +
            x -
            dw / 2;


        top =
            cy +
            y -
            nh / 2 -
            dh -
            24;

    }

    else if (x > 110) {

        left =
            cx +
            x +
            nw / 2 +
            24;


        top =
            cy +
            y -
            nh / 2;

    }

    else if (y > 110) {

        left =
            cx +
            x -
            dw / 2;


        top =
            cy +
            y +
            nh / 2 +
            24;

    }

    else {

        left =
            cx +
            x -
            nw / 2 -
            dw -
            24;


        top =
            cy +
            y -
            nh / 2;

    }


    left =
        Math.max(
            8,
            Math.min(
                rect.width -
                dw -
                8,
                left
            )
        );


    top =
        Math.max(
            8,
            Math.min(
                rect.height -
                dh -
                8,
                top
            )
        );


    detail.style.left =
        `${left}px`;


    detail.style.top =
        `${top}px`;

}


/* =========================================================
   ВОЗВРАТ ВКЛАДКИ
   ========================================================= */

function resetNodePosition(node) {

    node.style.setProperty(
        "--x",
        `${node.dataset.baseX}px`
    );


    node.style.setProperty(
        "--y",
        `${node.dataset.baseY}px`
    );

}


/* =========================================================
   ОБЫЧНОЕ СОСТОЯНИЕ
   ========================================================= */

function resetToObservation() {

    stage.classList.remove(
        "reading",
        "stories"
    );


    nodes.forEach(
        (node) => {

            node.classList.remove(
                "active"
            );

            resetNodePosition(
                node
            );

        }
    );


    storyLaunch.classList.remove(
        "active"
    );


    detail.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "hovering"
    );


    stateTitle.textContent =
        "Он наблюдает";


    stateText.textContent =
        "Все десять глаз следят за каждым движением.";

}


/* =========================================================
   НАВСТРЕЧУ К ИСТОРИЯМ
   ========================================================= */

function storiesOn() {

    stage.classList.remove(
        "reading"
    );


    stage.classList.add(
        "stories"
    );


    nodes.forEach(
        (node) => {

            node.classList.remove(
                "active"
            );

        }
    );


    storyLaunch.classList.add(
        "active"
    );


    detail.classList.remove(
        "show"
    );


    document.body.classList.add(
        "hovering"
    );


    stateTitle.textContent =
        "Навстречу к историям";


    stateText.textContent =
        "Он перестал наблюдать и готов рассказать свою историю.";

}


/* =========================================================
   ВЫБОР ВКЛАДКИ
   ========================================================= */

function chooseNode(node) {

    nodes.forEach(
        (item) => {

            item.classList.remove(
                "active"
            );

        }
    );


    storyLaunch.classList.remove(
        "active"
    );


    node.classList.add(
        "active"
    );


    stage.classList.remove(
        "stories"
    );


    stage.classList.add(
        "reading"
    );


    document.body.classList.add(
        "hovering"
    );


    const x =
        Number(
            node.dataset.baseX
        );


    const y =
        Number(
            node.dataset.baseY
        );


    const distance =
        Math.hypot(
            x,
            y
        ) || 1;


    const push = 46;


    node.style.setProperty(
        "--x",
        `${x + x / distance * push}px`
    );


    node.style.setProperty(
        "--y",
        `${y + y / distance * push}px`
    );


    stateTitle.textContent =
        "Он читает";


    stateText.textContent =
        "Выбранный раздел привлёк его внимание. Он закрыл пасть и принялся читать.";


    detail.querySelector(
        ".detail-title"
    ).textContent =
        node.dataset.title ||
        "Раздел";


    detail.querySelector(
        ".detail-text"
    ).textContent =
        node.dataset.text ||
        "Подробнее об этом разделе.";


    detail.querySelector(
        ".detail-cta"
    ).textContent =
        `${
            node.dataset.cta ||
            "Открыть раздел"
        } →`;


    positionDetail(
        node
    );


    detail.classList.add(
        "show"
    );

}


/* =========================================================
   НАВЕДЕНИЕ И КЛИКИ
   ========================================================= */

nodes.forEach(
    (node) => {

        node.addEventListener(
            "mouseenter",
            () => {

                chooseNode(
                    node
                );

            }
        );


        node.addEventListener(
            "mouseleave",
            () => {

                setTimeout(
                    () => {

                        const hoveredNode =
                            nodes.find(
                                (item) =>
                                    item.matches(
                                        ":hover"
                                    )
                            );


                        if (
                            !hoveredNode &&
                            !storyLaunch.matches(
                                ":hover"
                            )
                        ) {

                            resetToObservation();

                        }

                    },
                    40
                );

            }
        );


        node.addEventListener(
            "click",
            () => {

                chooseNode(
                    node
                );

            }
        );

    }
);


/* =========================================================
   КНОПКА ИСТОРИЙ
   ========================================================= */

storyLaunch.addEventListener(
    "mouseenter",
    storiesOn
);


storyLaunch.addEventListener(
    "focus",
    storiesOn
);


storyLaunch.addEventListener(
    "click",
    storiesOn
);


storyLaunch.addEventListener(
    "mouseleave",
    () => {

        setTimeout(
            () => {

                const hoveredNode =
                    nodes.find(
                        (node) =>
                            node.matches(
                                ":hover"
                            )
                    );


                if (
                    !hoveredNode
                ) {

                    resetToObservation();

                }

            },
            40
        );

    }
);


storyLaunch.addEventListener(
    "blur",
    () => {

        if (
            !storyLaunch.matches(
                ":hover"
            )
        ) {

            resetToObservation();

        }

    }
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        smoothX =
            window.innerWidth / 2;


        smoothY =
            window.innerHeight / 2;


        nodes.forEach(
            resetNodePosition
        );


        const activeNode =
            nodes.find(
                (node) =>
                    node.classList.contains(
                        "active"
                    )
            );


        if (
            activeNode
        ) {

            positionDetail(
                activeNode
            );

        }

    }
);
