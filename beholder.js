/* =========================================================
   ЭЛЕМЕНТЫ
   ========================================================= */

const stage =
    document.getElementById(
        "stage"
    );

const beholder =
    document.getElementById(
        "beholder"
    );

const orbit =
    document.getElementById(
        "orbit"
    );

const baseBody =
    document.getElementById(
        "baseBody"
    );

const readingBody =
    document.getElementById(
        "readingBody"
    );

const storiesBody =
    document.getElementById(
        "storiesBody"
    );

const storyLaunch =
    document.getElementById(
        "storyLaunch"
    );

const detail =
    document.getElementById(
        "detail"
    );

const cursorOrb =
    document.getElementById(
        "cursorOrb"
    );

const stateTitle =
    document.getElementById(
        "stateTitle"
    );

const stateText =
    document.getElementById(
        "stateText"
    );

const eyes =
    [
        ...document.querySelectorAll(
            ".eye-slot"
        )
    ];

const nodes =
    [
        ...document.querySelectorAll(
            ".node"
        )
    ];


/* =========================================================
   ИЗОБРАЖЕНИЯ
   ========================================================= */

baseBody.src =
    "assets/beholder/beholder-base.png";

readingBody.src =
    "assets/beholder/beholder-reading.png";


/* =========================================================
   ПЛАВНОЕ СЛЕЖЕНИЕ ГЛАЗ
   ========================================================= */

let targetMouseX =
    window.innerWidth / 2;

let targetMouseY =
    window.innerHeight / 2;


let smoothMouseX =
    targetMouseX;

let smoothMouseY =
    targetMouseY;


/*
   Каждый eye получает собственное состояние.
*/

const eyeState =
    eyes.map(
        () => ({
            x:0,
            y:0
        })
    );


document.addEventListener(
    "mousemove",
    event => {

        targetMouseX =
            event.clientX;

        targetMouseY =
            event.clientY;


        cursorOrb.style.left =
            targetMouseX + "px";

        cursorOrb.style.top =
            targetMouseY + "px";

    }
);


/*
   requestAnimationFrame делает движение
   значительно живее, чем прямое изменение
   позиции на каждом mousemove.
*/

function animateEyes(){

    smoothMouseX +=
        (
            targetMouseX -
            smoothMouseX
        ) * 0.18;


    smoothMouseY +=
        (
            targetMouseY -
            smoothMouseY
        ) * 0.18;


    if(
        !stage.classList.contains(
            "reading"
        ) &&
        !stage.classList.contains(
            "stories"
        )
    ){

        eyes.forEach(
            (eye,index) => {

                const rect =
                    eye.getBoundingClientRect();


                const eyeCenterX =
                    rect.left +
                    rect.width / 2;


                const eyeCenterY =
                    rect.top +
                    rect.height / 2;


                const dx =
                    smoothMouseX -
                    eyeCenterX;


                const dy =
                    smoothMouseY -
                    eyeCenterY;


                const distance =
                    Math.hypot(
                        dx,
                        dy
                    )
                    ||
                    1;


                /*
                   Максимум смещения
                   внутри белка.

                   12% — заметное, живое движение,
                   но с большим запасом до края.
                */

                const maxMove =
                    rect.width *
                    0.12;


                const factor =
                    Math.min(
                        maxMove /
                        distance,
                        1
                    );


                const desiredX =
                    dx *
                    factor;


                const desiredY =
                    dy *
                    factor;


                /*
                   У каждого глаза
                   своя скорость реакции.
                */

                const speed =
                    0.19 +
                    (
                        index % 3
                    ) * 0.035;


                eyeState[index].x +=
                    (
                        desiredX -
                        eyeState[index].x
                    )
                    *
                    speed;


                eyeState[index].y +=
                    (
                        desiredY -
                        eyeState[index].y
                    )
                    *
                    speed;


                /*
                   Движется весь готовый PNG:
                   его белок, радужка и ЧЁРНЫЙ ЗРАЧОК
                   остаются единым изображением.
                */

                const image =
                    eye.querySelector(
                        ".eye-image"
                    );


                const scale =
                    Number(
                        image
                            .closest(".eye-slot")
                            .classList.contains("eye1")
                            ? 1
                            : 1
                    );


                image.style.transform =
                    `
                    translate(
                        calc(
                            -50%
                            +
                            ${eyeState[index].x}px
                        ),
                        calc(
                            -50%
                            +
                            ${eyeState[index].y}px
                        )
                    )
                    scale(${scale})
                    `;

            }
        );

    }


    requestAnimationFrame(
        animateEyes
    );
}


animateEyes();


/* =========================================================
   ВКЛАДКИ — ЖИВОЕ ДВИЖЕНИЕ ПО ИХ СОБСТВЕННОЙ ОСИ
   ========================================================= */

let stageMouseX = 0;
let stageMouseY = 0;
let stageHasPointer = false;

stage.addEventListener(
    "mousemove",
    event => {
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


/*
   Таблички постоянно слегка «живут» вокруг своей оси.
   Амплитуда небольшая, поэтому попасть по ним по-прежнему легко.
   У каждой вкладки своя скорость и фаза, чтобы они не двигались строем.
*/

function animateNodes(time){

    const seconds =
        time / 1000;

    nodes.forEach(
        (node,index) => {

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

            /*
               Индивидуальная скорость.
            */

            const speed =
                0.72 +
                index * 0.055;

            const phase =
                index * 1.37;

            /*
               Тангенциальное смещение.
            */

            const idle =
                Math.sin(
                    seconds * speed +
                    phase
                ) *
                (
                    9 +
                    (index % 3) * 2.5
                );

            /*
               Второе лёгкое колебание.
            */

            const secondary =
                Math.sin(
                    seconds * (speed * 1.73) +
                    phase * 0.63
                ) *
                2.8;

            let pointerTangent = 0;

            if(stageHasPointer){

                const tangentForce =
                    Math.max(
                        -28,
                        Math.min(
                            28,
                            stageMouseY / 12
                        )
                    );

                pointerTangent =
                    tangentForce *
                    (
                        .20 +
                        index * .012
                    );
            }

            const tangent =
                idle +
                secondary +
                pointerTangent;

            const x =
                baseX +
                -Math.sin(angle) *
                tangent;

            const y =
                baseY +
                Math.cos(angle) *
                tangent;

            /*
               Не трогаем координаты активной вкладки.
            */

            if(!node.classList.contains("active")){

                node.style.setProperty(
                    "--x",
                    x.toFixed(2) +
                    "px"
                );

                node.style.setProperty(
                    "--y",
                    y.toFixed(2) +
                    "px"
                );
            }
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
   БАЗОВЫЕ КООРДИНАТЫ
   ========================================================= */

nodes.forEach(
    node => {

        const x =
            parseFloat(
                getComputedStyle(
                    node
                )
                .getPropertyValue(
                    "--base-x"
                )
            );


        const y =
            parseFloat(
                getComputedStyle(
                    node
                )
                .getPropertyValue(
                    "--base-y"
                )
            );


        node.dataset.baseX =
            x;

        node.dataset.baseY =
            y;

    }
);


/* =========================================================
   ТРЕТЬЕ СОСТОЯНИЕ
   ========================================================= */

function storiesOn(){

    stage.classList.remove(
        "reading"
    );

    stage.classList.add(
        "stories"
    );


    nodes.forEach(
        n =>
            n.classList.remove(
                "active"
            )
    );


    storyLaunch.classList.add(
        "active"
    );


    state.textContent =
        "НАВСТРЕЧУ К ИСТОРИЯМ";


    detail.classList.remove(
        "show"
    );
}


function resetToObservation(){

    stage.classList.remove(
        "reading",
        "stories"
    );


    nodes.forEach(
        n =>
            n.classList.remove(
                "active"
            )
    );


    storyLaunch.classList.remove(
        "active"
    );


    state.textContent =
        "ОН НАБЛЮДАЕТ";


    detail.classList.remove(
        "show"
    );
}


/* =========================================================
   НАВЕДЕНИЕ
   ========================================================= */

function chooseNode(
    node
){

    nodes.forEach(
        n =>
            n.classList.remove(
                "active"
            )
    );


    node.classList.add(
        "active"
    );


    /*
       Выбранная вкладка
       отъезжает наружу.
    */

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
        )
        ||
        1;


    const push =
        46;


    node.style.setProperty(
        "--x",
        (
            x
            +
            x / distance *
            push
        )
        + "px"
    );


    node.style.setProperty(
        "--y",
        (
            y
            +
            y / distance *
            push
        )
        + "px"
    );


    /*
       Переход бехолдера
       в состояние чтения.
    */

    stage.classList.add(
        "reading"
    );


    document.body.classList.add(
        "hovering"
    );


    stateTitle.textContent =
        "Он читает";


    stateText.textContent =
        "Выбранный раздел привлёк его внимание. Он закрыл пасть и принялся читать.";


    /*
       Наполняем сводку.
    */

    detail.querySelector(
        ".detail-title"
    ).textContent =
        node.dataset.title;


    detail.querySelector(
        ".detail-text"
    ).textContent =
        node.dataset.text;


    detail.querySelector(
        ".detail-cta"
    ).textContent =
        node.dataset.cta
        +
        " →";


    positionDetail(
        node
    );


    detail.classList.add(
        "show"
    );

}


/* =========================================================
   ПОЗИЦИЯ СВОДКИ
   ========================================================= */

function positionDetail(
    node
){

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
        );


    const y =
        parseFloat(
            node.style.getPropertyValue(
                "--y"
            )
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


    if(
        y < -110
    ){

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
    else if(
        x > 110
    ){

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
    else if(
        y > 110
    ){

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
    else{

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
        left + "px";


    detail.style.top =
        top + "px";
}


/* =========================================================
   ВЫХОД
   ========================================================= */

function restoreNode(
    node
){

    const x =
        Number(
            node.dataset.baseX
        );

    const y =
        Number(
            node.dataset.baseY
        );


    node.style.setProperty(
        "--x",
        x + "px"
    );


    node.style.setProperty(
        "--y",
        y + "px"
    );

}


/*
   Не возвращаем состояние,
   пока мышь ещё находится
   над соседней кнопкой.
*/

nodes.forEach(
    node => {

        node.addEventListener(
            "mouseenter",
            () =>
                chooseNode(
                    node
                )
        );


        node.addEventListener(
            "mouseleave",
            () => {

                /*
                   Даём соседней кнопке
                   успеть перехватить курсор.
                */

                setTimeout(
                    () => {

                        const hovered =
                            nodes.find(
                                n =>
                                    n.matches(
                                        ":hover"
                                    )
                            );


                        if(
                            !hovered
                        ){

                            node.classList.remove(
                                "active"
                            );


                            stage.classList.remove(
                                "reading"
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
                                "Все десять глаз следят за курсором.";


                            nodes.forEach(
                                restoreNode
                            );

                        }

                    },
                    30
                );

            }
        );

    }
);


/* =========================================================
   TOUCH / PHONE
   ========================================================= */

nodes.forEach(
    node => {

        node.addEventListener(
            "click",
            () =>
                chooseNode(
                    node
                )
        );

    }
);



/* =========================================================
   КНОПКА «НАВСТРЕЧУ К ИСТОРИЯМ»
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
    "mouseleave",
    () => {

        setTimeout(
            () => {

                const hoveredNode =
                    nodes.find(
                        n =>
                            n.matches(
                                ":hover"
                            )
                    );

                if(!hoveredNode){

                    resetToObservation();

                }

            },
            40
        );

    }
);

storyLaunch.addEventListener(
    "blur",
    resetToObservation
);

storyLaunch.addEventListener(
    "click",
    storiesOn
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        smoothMouseX =
            window.innerWidth /
            2;

        smoothMouseY =
            window.innerHeight /
            2;

        nodes.forEach(
            restoreNode
        );

    }
);
