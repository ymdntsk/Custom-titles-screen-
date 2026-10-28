//=============================================================================
// CustomTitleScreen.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Tela inicial customizável: fundo trocável e botões em imagem com hover, em qualquer posição.
 * @author Você
 *
 * @help
 * ============================================================================
 * CustomTitleScreen
 * ============================================================================
 * Troca o menu da tela inicial por botões feitos com imagens.
 *
 * COMO USAR
 * 1. Salve como CustomTitleScreen.js em js/plugins/ (o nome precisa ser esse).
 * 2. Coloque as imagens dos botões em img/system/.
 *    Fundo da tela inicial: img/titles1/.
 * 3. Ative o plugin e configure os parâmetros.
 *
 * BOTÕES
 * Cada botão tem uma ação, uma posição (x, y) e até 3 imagens:
 *   - Imagem normal  : botão parado.
 *   - Imagem de hover: quando o mouse está em cima (ou o botão está
 *                      selecionado pelo teclado/controle).
 *   - Imagem desativada (opcional): usada quando o botão não pode ser
 *                      usado (ex: "Continuar" sem nenhum save).
 * Se você não colocar imagens, o plugin desenha um botão simples com o
 * texto, só para você testar a posição.
 *
 * A posição (x, y) é o CENTRO do botão ou o CANTO SUPERIOR ESQUERDO,
 * conforme o parâmetro "Origem da posição". A tela padrão tem 816x624.
 *
 * Mesmo sem imagem de hover, o botão fica um pouco maior e mais claro
 * quando destacado.
 *
 * COMPATIBILIDADE COM O PLUGIN CREDITS
 * A ação "Créditos" abre a tela do plugin Credits. Se o plugin Credits não
 * estiver ativo, o botão de créditos simplesmente não aparece.
 *
 * TECLADO / CONTROLE
 * As setas movem a seleção para o botão mais próximo na direção apertada,
 * então funciona com qualquer posição. Enter / Z confirma.
 *
 * @param backgroundImage
 * @text Imagem de fundo
 * @desc Imagem em img/titles1/. Vazio = usa o fundo definido no banco de dados.
 * @type file
 * @dir img/titles1/
 * @require 1
 *
 * @param showGameTitle
 * @text Mostrar o nome do jogo (texto)
 * @desc Desligue se o seu fundo já tem o logo/título desenhado.
 * @type boolean
 * @on Sim
 * @off Não
 * @default true
 *
 * @param buttonOrigin
 * @text Origem da posição
 * @desc A posição (x, y) dos botões marca o centro ou o canto superior esquerdo?
 * @type select
 * @option Centro do botão
 * @value center
 * @option Canto superior esquerdo
 * @value topleft
 * @default center
 *
 * @param hoverScale
 * @text Tamanho no hover
 * @desc 1 = sem mudança, 1.05 = 5% maior ao destacar.
 * @type number
 * @decimals 2
 * @min 0.5
 * @default 1.05
 *
 * @param pressScale
 * @text Tamanho ao clicar
 * @desc Tamanho do botão enquanto o clique está pressionado.
 * @type number
 * @decimals 2
 * @min 0.5
 * @default 0.97
 *
 * @param fontSize
 * @text Tamanho da fonte (botões sem imagem)
 * @type number
 * @min 1
 * @default 28
 *
 * @param autoSelectFirst
 * @text Destacar o primeiro botão ao abrir
 * @desc Desligado: nenhum botão fica destacado até o mouse passar ou uma tecla ser apertada.
 * @type boolean
 * @on Sim
 * @off Não
 * @default true
 *
 * @param buttons
 * @text Botões
 * @desc Lista de botões da tela inicial.
 * @type struct<TitleButton>[]
 * @default ["{\"action\":\"newGame\",\"label\":\"Novo Jogo\",\"x\":\"408\",\"y\":\"340\",\"normalImage\":\"\",\"hoverImage\":\"\",\"disabledImage\":\"\",\"width\":\"260\",\"height\":\"48\"}","{\"action\":\"continue\",\"label\":\"Continuar\",\"x\":\"408\",\"y\":\"400\",\"normalImage\":\"\",\"hoverImage\":\"\",\"disabledImage\":\"\",\"width\":\"260\",\"height\":\"48\"}","{\"action\":\"options\",\"label\":\"Opções\",\"x\":\"408\",\"y\":\"460\",\"normalImage\":\"\",\"hoverImage\":\"\",\"disabledImage\":\"\",\"width\":\"260\",\"height\":\"48\"}","{\"action\":\"credits\",\"label\":\"Créditos\",\"x\":\"408\",\"y\":\"520\",\"normalImage\":\"\",\"hoverImage\":\"\",\"disabledImage\":\"\",\"width\":\"260\",\"height\":\"48\"}"]
 */

/*~struct~TitleButton:
 * @param action
 * @text Ação
 * @desc O que o botão faz.
 * @type select
 * @option Novo jogo
 * @value newGame
 * @option Continuar
 * @value continue
 * @option Opções
 * @value options
 * @option Créditos (requer o plugin Credits)
 * @value credits
 * @option Sair do jogo
 * @value exit
 * @default newGame
 *
 * @param label
 * @text Texto
 * @desc Só aparece se o botão não tiver imagem.
 * @type string
 * @default Botão
 *
 * @param x
 * @text Posição X
 * @type number
 * @min -9999
 * @default 408
 *
 * @param y
 * @text Posição Y
 * @type number
 * @min -9999
 * @default 340
 *
 * @param normalImage
 * @text Imagem normal
 * @desc Imagem em img/system/.
 * @type file
 * @dir img/system/
 * @require 1
 *
 * @param hoverImage
 * @text Imagem de hover
 * @desc Imagem em img/system/ usada quando o botão está destacado.
 * @type file
 * @dir img/system/
 * @require 1
 *
 * @param disabledImage
 * @text Imagem desativada
 * @desc Opcional. Usada quando o botão não pode ser usado.
 * @type file
 * @dir img/system/
 * @require 1
 *
 * @param width
 * @text Largura (sem imagem)
 * @type number
 * @min 1
 * @default 260
 *
 * @param height
 * @text Altura (sem imagem)
 * @type number
 * @min 1
 * @default 48
 */

(() => {
    "use strict";

    const pluginName = "CustomTitleScreen";
    const params = PluginManager.parameters(pluginName);

    const num = (v, d) => {
        const n = Number(v);
        return (v === undefined || v === "" || Number.isNaN(n)) ? d : n;
    };
    const bool = (v, d) => (v === undefined || v === "" ? d : String(v) === "true");

    //-------------------------------------------------------------------------
    // Parâmetros
    //-------------------------------------------------------------------------

    const backgroundImage = String(params.backgroundImage || "");
    const showGameTitle = bool(params.showGameTitle, true);
    const buttonOrigin = String(params.buttonOrigin || "center");
    const hoverScale = num(params.hoverScale, 1.05);
    const pressScale = num(params.pressScale, 0.97);
    const fontSize = num(params.fontSize, 28);
    const autoSelectFirst = bool(params.autoSelectFirst, true);

    function parseButtons() {
        let list = [];
        try {
            list = JSON.parse(params.buttons || "[]").map(s => JSON.parse(s));
        } catch (e) {
            console.error(pluginName + ": erro ao ler os botões.", e);
        }
        return list.map(b => ({
            action: String(b.action || "newGame"),
            label: String(b.label || ""),
            x: num(b.x, 0),
            y: num(b.y, 0),
            normalImage: String(b.normalImage || ""),
            hoverImage: String(b.hoverImage || ""),
            disabledImage: String(b.disabledImage || ""),
            width: Math.max(1, num(b.width, 260)),
            height: Math.max(1, num(b.height, 48))
        }));
    }

    const baseButtons = parseButtons();

    //-------------------------------------------------------------------------
    // Botão simples desenhado por código (usado quando não há imagem)
    //-------------------------------------------------------------------------

    function makeFallbackBitmap(data, highlighted) {
        const w = data.width;
        const h = data.height;
        const bitmap = new Bitmap(w, h);
        bitmap.fillRect(0, 0, w, h, highlighted ? "#ffffff" : "#aaaaaa");
        bitmap.fillRect(2, 2, w - 4, h - 4, highlighted ? "rgba(40,90,180,0.95)" : "rgba(0,0,0,0.65)");
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.fontSize = fontSize;
        bitmap.textColor = "#ffffff";
        bitmap.drawText(data.label, 0, 0, w, h, "center");
        return bitmap;
    }

    //-------------------------------------------------------------------------
    // Sprite_CustomTitleButton
    //-------------------------------------------------------------------------

    function Sprite_CustomTitleButton() {
        this.initialize(...arguments);
    }

    Sprite_CustomTitleButton.prototype = Object.create(Sprite_Clickable.prototype);
    Sprite_CustomTitleButton.prototype.constructor = Sprite_CustomTitleButton;

    Sprite_CustomTitleButton.prototype.initialize = function(data) {
        Sprite_Clickable.prototype.initialize.call(this);
        this._data = data;
        this._highlighted = false;
        this._enabled = true;
        this._hoverHandler = null;
        this._clickHandler = null;

        const hasImage = !!data.normalImage;
        this._normalBitmap = hasImage
            ? ImageManager.loadSystem(data.normalImage)
            : makeFallbackBitmap(data, false);
        if (data.hoverImage) {
            this._hoverBitmap = ImageManager.loadSystem(data.hoverImage);
        } else {
            this._hoverBitmap = hasImage ? null : makeFallbackBitmap(data, true);
        }
        this._disabledBitmap = data.disabledImage
            ? ImageManager.loadSystem(data.disabledImage)
            : null;

        this.bitmap = this._normalBitmap;
        const origin = buttonOrigin === "center" ? 0.5 : 0;
        this.anchor.set(origin, origin);
        this.x = data.x;
        this.y = data.y;
    };

    Sprite_CustomTitleButton.prototype.data = function() {
        return this._data;
    };

    Sprite_CustomTitleButton.prototype.setHighlighted = function(value) {
        this._highlighted = value;
    };

    Sprite_CustomTitleButton.prototype.setEnabled = function(value) {
        this._enabled = value;
    };

    // Área clicável = tamanho da imagem (sem contar a animação de tamanho).
    Sprite_CustomTitleButton.prototype.hitTest = function(x, y) {
        const bitmap = this.bitmap;
        if (!bitmap || !bitmap.isReady()) {
            return false;
        }
        const w = bitmap.width;
        const h = bitmap.height;
        return new Rectangle(-this.anchor.x * w, -this.anchor.y * h, w, h).contains(x, y);
    };

    Sprite_CustomTitleButton.prototype.onMouseEnter = function() {
        if (this._hoverHandler) {
            this._hoverHandler();
        }
    };

    Sprite_CustomTitleButton.prototype.onClick = function() {
        if (this._clickHandler) {
            this._clickHandler();
        }
    };

    Sprite_CustomTitleButton.prototype.update = function() {
        Sprite_Clickable.prototype.update.call(this);
        this.updateVisual();
    };

    Sprite_CustomTitleButton.prototype.currentBitmap = function() {
        if (!this._enabled && this._disabledBitmap) {
            return this._disabledBitmap;
        }
        if (this._enabled && this._highlighted && this._hoverBitmap) {
            return this._hoverBitmap;
        }
        return this._normalBitmap;
    };

    Sprite_CustomTitleButton.prototype.updateVisual = function() {
        const bitmap = this.currentBitmap();
        if (this.bitmap !== bitmap) {
            this.bitmap = bitmap;
        }
        const lit = this._enabled && this._highlighted;
        let target = 1;
        if (this._enabled && this._pressed) {
            target = pressScale;
        } else if (lit) {
            target = hoverScale;
        }
        let s = this.scale.x + (target - this.scale.x) * 0.3;
        if (Math.abs(target - s) < 0.001) {
            s = target;
        }
        this.scale.set(s, s);

        if (this._enabled) {
            this.opacity = 255;
            // Sem imagem de hover própria: clareia a imagem normal.
            const brighten = lit && !this._hoverBitmap;
            this.setColorTone(brighten ? [35, 35, 35, 0] : [0, 0, 0, 0]);
        } else {
            this.opacity = this._disabledBitmap ? 255 : 120;
            this.setColorTone([0, 0, 0, 0]);
        }
    };

    //-------------------------------------------------------------------------
    // Scene_Title
    //-------------------------------------------------------------------------

    // Fundo
    const _Scene_Title_createBackground = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        _Scene_Title_createBackground.call(this);
        if (backgroundImage) {
            this._backSprite1.bitmap = ImageManager.loadTitle1(backgroundImage);
            this._backSprite2.bitmap = ImageManager.loadTitle2("");
        }
    };

    // Nome do jogo em texto
    const _Scene_Title_drawGameTitle = Scene_Title.prototype.drawGameTitle;
    Scene_Title.prototype.drawGameTitle = function() {
        if (showGameTitle) {
            _Scene_Title_drawGameTitle.call(this);
        }
    };

    // A janela padrão continua existindo (outros plugins podem depender dela),
    // mas fica escondida e inativa. Os botões novos assumem o lugar dela.
    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.hide();
        this._commandWindow.deactivate();
        this.createCustomButtons();
    };

    Scene_Title.prototype.createCustomButtons = function() {
        const hasCredits = typeof Scene_Credits !== "undefined";
        const list = baseButtons.filter(b => b.action !== "credits" || hasCredits);
        this._customButtons = [];
        this._customChosen = false;
        this._customHasSave = DataManager.isAnySavefileExists();
        this._customIndex = autoSelectFirst && list.length > 0 ? 0 : -1;
        this._customLayer = new Sprite();
        this.addChild(this._customLayer);
        list.forEach((data, i) => {
            const sprite = new Sprite_CustomTitleButton(data);
            sprite._hoverHandler = () => this.onCustomButtonHover(i);
            sprite._clickHandler = () => this.onCustomButtonClick(i);
            this._customLayer.addChild(sprite);
            this._customButtons.push(sprite);
        });
        this.refreshCustomButtons();
    };

    const _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.call(this);
        this.updateCustomButtons();
    };

    Scene_Title.prototype.isCustomInputEnabled = function() {
        return !!this._customButtons &&
            this._customButtons.length > 0 &&
            !this._customChosen &&
            !this.isBusy() &&
            this._commandWindow.isOpen();
    };

    Scene_Title.prototype.isCustomButtonEnabled = function(index) {
        const button = this._customButtons[index];
        if (!button) {
            return false;
        }
        return button.data().action !== "continue" || this._customHasSave;
    };

    Scene_Title.prototype.refreshCustomButtons = function() {
        this._customButtons.forEach((sprite, i) => {
            sprite.setHighlighted(i === this._customIndex);
            sprite.setEnabled(this.isCustomButtonEnabled(i));
        });
    };

    Scene_Title.prototype.updateCustomButtons = function() {
        if (!this._customButtons) {
            return;
        }
        this.refreshCustomButtons();
        if (!this.isCustomInputEnabled()) {
            return;
        }
        const directions = ["up", "down", "left", "right"];
        for (const dir of directions) {
            if (Input.isRepeated(dir)) {
                this.moveCustomSelection(dir);
                return;
            }
        }
        if (Input.isTriggered("ok") && this._customIndex >= 0) {
            this.activateCustomButton(this._customIndex);
        }
    };

    Scene_Title.prototype.selectCustomButton = function(index) {
        if (index !== this._customIndex) {
            this._customIndex = index;
            SoundManager.playCursor();
        }
    };

    // Move para o botão mais próximo na direção apertada.
    Scene_Title.prototype.moveCustomSelection = function(dir) {
        const count = this._customButtons.length;
        if (this._customIndex < 0) {
            this.selectCustomButton(0);
            return;
        }
        const vec = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
        const current = this._customButtons[this._customIndex];
        let best = -1;
        let bestScore = Infinity;
        this._customButtons.forEach((b, i) => {
            if (i === this._customIndex) {
                return;
            }
            const dx = b.x - current.x;
            const dy = b.y - current.y;
            const along = dx * vec[0] + dy * vec[1];
            if (along <= 0) {
                return;
            }
            const across = Math.abs(dx * vec[1] - dy * vec[0]);
            const score = along + across * 2;
            if (score < bestScore) {
                bestScore = score;
                best = i;
            }
        });
        if (best < 0 && count > 1) {
            // Nenhum botão naquela direção: segue a ordem da lista (com volta).
            const forward = dir === "down" || dir === "right";
            best = (this._customIndex + (forward ? 1 : count - 1)) % count;
        }
        if (best >= 0) {
            this.selectCustomButton(best);
        }
    };

    Scene_Title.prototype.onCustomButtonHover = function(index) {
        if (this.isCustomInputEnabled()) {
            this.selectCustomButton(index);
        }
    };

    Scene_Title.prototype.onCustomButtonClick = function(index) {
        if (this.isCustomInputEnabled()) {
            this._customIndex = index;
            this.activateCustomButton(index);
        }
    };

    Scene_Title.prototype.activateCustomButton = function(index) {
        if (!this.isCustomButtonEnabled(index)) {
            SoundManager.playBuzzer();
            return;
        }
        const action = this._customButtons[index].data().action;
        SoundManager.playOk();
        switch (action) {
            case "newGame":
                this._customChosen = true;
                this.commandNewGame();
                break;
            case "continue":
                this._customChosen = true;
                this.commandContinue();
                break;
            case "options":
                this._customChosen = true;
                this.commandOptions();
                break;
            case "credits":
                this._customChosen = true;
                this._commandWindow.close();
                SceneManager.push(Scene_Credits);
                break;
            case "exit":
                this._customChosen = true;
                this._commandWindow.close();
                this.fadeOutAll();
                SceneManager.exit();
                break;
        }
    };

    window.Sprite_CustomTitleButton = Sprite_CustomTitleButton;
})();
