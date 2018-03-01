const minuteToMil = 60000;
const subdivision = 4;
const monoAudio   = new Audio();

const sounds      = {
    'kick':     {'src': 'assets/samples/03_BASS_01.wav',       'volume': 1   },
    'snare':    {'src': 'assets/samples/06_SNARE_01.wav',      'volume': 1   },
    'clap':     {'src': 'assets/samples/26_CLAP.wav',          'volume': 0.1 },
    'clHat':    {'src': 'assets/samples/09_HI-HAT_CLOSED.wav', 'volume': 0.2 },
    'opHat':    {'src': 'assets/samples/11_HI-HAT_OPEN.wav',   'volume': 0.07},
    'yeah':     {'src': 'assets/samples/awyeah.wav',           'volume': 0.4 },
    'feel':     {'src': 'assets/samples/canyoufeelit.wav',     'volume': 0.4 },
    'check':    {'src': 'assets/samples/checkthisout.wav',     'volume': 0.4 },
    'here':     {'src': 'assets/samples/herewego.wav',         'volume': 0.4 },
    'oww':      {'src': 'assets/samples/oww.wav',              'volume': 0.4 },
    'woo':      {'src': 'assets/samples/woo.wav',              'volume': 0.4 },
    'hiTom':    {'src': 'assets/samples/12_TOM_01.wav',        'volume': 0.3 },
    'midTom':   {'src': 'assets/samples/14_TOM_03.wav',        'volume': 0.3 },
    'loTom':    {'src': 'assets/samples/17_TOM_06.wav',        'volume': 0.3 },
    'cowbell':  {'src': 'assets/samples/808cowbell.wav',       'volume': 0.5 }
};

const pattern     = [
    {'name': 'kick',    'seq': [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]},
    {'name': 'snare',   'seq': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
    {'name': 'clap',    'seq': [0,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0]},
    {'name': 'clHat',   'seq': [1,0,1,0,1,0,1,0,0,1,0,1,1,0,1,0]},
    {'name': 'opHat',   'seq': [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1]}
];

let timer;
let $startButton;
let swing         = false;
let tempo         = 60;
let interval      = Math.round((minuteToMil / tempo) / subdivision);

function initAudioPlayer() {
    setObjReference();
    handleStartStop();
    handleVolInput();
    bindDrumKeys();
    togglePattern();
    handleSwing();
}

function setObjReference() {
    $startButton = document.querySelector('.start-stop button');
    $simpleButtons = document.querySelectorAll('.simple-button');

    for (const $button of $simpleButtons) {
        $button.addEventListener('click', function(e) {
            e.currentTarget.classList.toggle('active');

            if ($button.className.match(/(^| )kick( |$)/)) trigger(sounds.kick);
            else if ($button.className.match(/(^| )snare( |$)/)) trigger(sounds.snare);
            else if ($button.className.match(/(^| )clhat( |$)/)) trigger(sounds.clHat);
            else if ($button.className.match(/(^| )ophat( |$)/)) trigger(sounds.opHat);
            else if ($button.className.match(/(^| )clap( |$)/)) trigger(sounds.clap);
        });
    }
}

function handleSwing() {
    document.querySelector('.swing button').addEventListener('click', function (e) {
        e.target.classList.toggle('active');
        swing = !swing;
    });
}

function loadPattern() {
    $rows = document.querySelectorAll('.row');

    for (let i = 0; i < $rows.length; i++) {
        const $rowButtons = $rows[i].querySelectorAll('button');

        for (let j = 0; j < $rowButtons.length; j++) {
            if (pattern[i].seq[j] === 1) {
                $rowButtons[j].classList.add('active');
            }
        }
    }
}

function togglePattern() {
    loadPattern();

    document.querySelector('.toggle-pattern button').addEventListener('click', function (e) {
        var $this = e.target;
        $this.classList.toggle('active');
        if ($this.classList.contains('active')) {
            loadPattern();
        } else {
            const $rowButtons = document.querySelectorAll('.row button');

            for (const $button of $rowButtons) {
                if ($button.classList.contains('active')) $button.classList.remove('active');
            }
        }
    });
}

function handleStartStop() {
    const $glow = document.querySelector('.glow');
    let count = 0;

    $startButton.addEventListener('click', function(e) {
        let init = new Date().getTime();
        e.currentTarget.classList.toggle('active');
        handleTempo(init);
        if ($startButton.classList.contains('active')) {
            $glow.classList.remove('hide');
            loop();
        } else {
            clearTimeout(timer);
            count = 0;
            document.querySelector('.glow').classList.add('hide');

            for (const $simpleButton of document.querySelectorAll('.simple-button')) {
                $simpleButton.classList.remove('on');
            }
        }

        function loop() {
            timer = setTimeout(function() {
                var init2 = new Date().getTime();
                if (count === subdivision * 4) count = 0;
                playSubdiv(count);
                handleTempo(init2);
                count++;
                loop();
            }, interval);
        }
    });
}

function handleTempo(init) {
    var diff = new Date().getTime() - init;

    tempo = document.querySelector('.tempo input').value;
    interval = Math.round((minuteToMil / tempo) / subdivision - diff);
}

function handleVolInput() {
    document.onkeydown = function (e) {
        e = e || window.event;

        var $input = document.querySelector('.tempo input');
        var volume = Number($input.value);

        switch (e.keyCode) {
            case 38: // up arrow
                tempo = volume + 1;
                $input.value = tempo;
                break;
            case 40: // down arrow
                tempo = volume - 1;
                $input.value = tempo;
                break;
            case 37: // left arrow
               tempo = volume - 1;
               $input.value = tempo;
               break;
            case 39:  // right arrow
               tempo = volume + 1;
               $input.value = tempo;
               break;
        }
    };
}

function bindDrumKeys() {
    window.addEventListener("keydown", function() {
        if (document.querySelector('.tempo input') === document.activeElement) {
            return;
        }

        switch (window.event.keyCode) {
            case 49:
                trigger(sounds.kick);
                break;
            case 50:
                trigger(sounds.snare);
                break;
            case 51:
                trigger(sounds.clap);
                break;
            case 52:
                trigger(sounds.cowbell);
                break;
            case 53:
                trigger(sounds.hiTom);
                break;
            case 54:
                trigger(sounds.midTom);
                break;
            case 55:
                trigger(sounds.loTom);
                break;
            case 56:
                triggerMono(sounds.yeah);
                break;
            case 57:
                triggerMono(sounds.oww);
                break;
            case 48:
                triggerMono(sounds.woo);
                break;
            case 32:
                $startButton.click();
                break;
        }
    });
}

function triggerMono(sound, count) {
    monoAudio.src       = sound.src;
    monoAudio.volume    = sound.volume;

    playSound(monoAudio);
}

function trigger(sound, count) {
    var audio       = new Audio();
    audio.src       = sound.src;
    audio.volume    = sound.volume;

    if (swing && (count % 2 === 1)) {
        setTimeout(function () {
            playSound(audio); //delayed trigger
        }, interval/(Math.random() * 3 + 2));
    } else {
       playSound(audio); //normal
    }
}

function playSound(audio) {
    var $glow = document.querySelector('.glow');

    audio.play();
    $glow.classList.remove('hide');

    setTimeout(function () {
        $glow.classList.add('hide');
    }, interval - 5);
}

function playSubdiv(count) {
    const rows = document.getElementsByClassName('row');

    for (let i = 0; i < rows.length; i++) {
        const $buttons = rows[i].getElementsByClassName('simple-button');

        for (let j = 0; j < $buttons.length; j++) {
            const $button = $buttons[j];
            $button.classList.remove('on');
            if (j === count) {
                if ($button.className.match(/(^| )active( |$)/)) {
                    if ($button.className.match(/(^| )kick( |$)/)) trigger(sounds.kick, count);
                    else if ($button.className.match(/(^| )snare( |$)/)) trigger(sounds.snare, count);
                    else if ($button.className.match(/(^| )clhat( |$)/)) trigger(sounds.clHat, count);
                    else if ($button.className.match(/(^| )ophat( |$)/)) trigger(sounds.opHat, count);
                    else if ($button.className.match(/(^| )clap( |$)/)) trigger(sounds.clap, count);
                }
                $button.classList.add('on');
            }
        }
    }
}

window.addEventListener("load", initAudioPlayer);
