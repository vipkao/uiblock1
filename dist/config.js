///<reference path="./test001.bundle.js"/>

///TODO webpackでおそらくES Modules形式で出力する方法を探る。それまでは直指定
//import Concrete from "../src/Concrete";
//import Element_Shape from "../src/Element_Shape";


var config = {};
config.start = function(){
    this.template = 'TappableOpeningPixiP2';
    this.data = {
        width: 1066,
        height: 800,
        buttonString: 'ういういブロック崩し\r\rここをクリックしてスタート！',
        backgroundImageUrl: '../haikei02.jpg',
        fadeoutColor: 0xFFFFFF,
        nextStage: 'stage1',
    };
};
config.stage1 = function(){
    const BAR_AREA_HEIGHT = 100;
    const STAGE_WIDTH = 1066;
    const STAGE_HEIGHT = 800 + BAR_AREA_HEIGHT;
    const BAR_HEIGHT = 10;
    const BALL_RADIUS = 12;

    this.template = 'FullCustomizeStandardAreaPixiP2';
    this.data = {
        backgroundColor: 0xFFFFFF,
        stageWidth: STAGE_WIDTH,
        stageHeight: STAGE_HEIGHT,
        barAreaHeight: BAR_AREA_HEIGHT,
        barPositionY: STAGE_HEIGHT - BAR_AREA_HEIGHT / 2,
        barHeight: BAR_HEIGHT,
        ballRadius: BALL_RADIUS,
        tapAllowance: 10,
        ballReleaseVelocity: [300, -500],
        directLoad:{
            'haikei01.jpg': '../haikei01.jpg',
            'haikei02.jpg': '../haikei02.jpg',
            'uiren01.jpg': '../uiren01.jpg',
            'uiren02.png': '../uiren02.png',
            'uiren03.jpg': '../uiren03.jpg',
        },
        jsonpLoad:{
        },

        /**
         * @param {Concrete.IConcreteShapeRegisterer} register
         * @param {Element_Shape.ILooksShape} looksShape
         * @param {Element_Shape.IPhysicalShape} physicalShape
         */
        shapeRegisterFunction: function(
            register, looksShape, physicalShape, tween
        ){
            const PLAYAREA_WALL_THICK = 100;
            const BAR_WIDTH = 300;
            const BAR_PHISICS_POW = 20;
            const BULLET_RADIUS = 10;
            const BULLET_PHISICS_POW = 20;
            const ITEM_RADIUS = 10;
            const LOSTAREA_Y = STAGE_HEIGHT - 10;
            const LOSTAREA_THICK = 100;
                                    
            register.registBall(
                '', g => {
                    //TODO ここもう少しスマートにやりたい
                    //互換性を保ちつつ可能か？
                    looksShape.Circle(BALL_RADIUS, 0x000000, 1.0)(g);
                    looksShape.Circle(BALL_RADIUS - 2, 0xFFFFFF, 1.0)(g);
                    return g;
                }, physicalShape.Circle(BALL_RADIUS)
            );
    
            //バグ
            //itemがcircleで、barがboxとする場合、circleの半径未満のboxの厚さの場合、beginContactが複数起きる。
            register.registBlock(
                'block', looksShape.SizedRect(0x009999, 1.0), looksShape.SizedPreviewRect(), physicalShape.SizedBox()
            );
            register.registBlock(
                'blockVisual', looksShape.SizedRect(0x009999, 1.0), null, null
            );
            register.registBlock(
                'invisible', looksShape.SizedEmpty(), looksShape.SizedPreviewRect(), physicalShape.SizedBox()
            );
            register.registBlock(
                'visualOnly', looksShape.SizedRect(0x009999, 1.0), looksShape.SizedPreviewRect(), null
            );
            register.registBlock(
                'invisibleVisual', looksShape.SizedEmpty(), null, null
            );
            register.registBlock(
                'heart', looksShape.SizedHeart(0xFF6666), looksShape.SizedPreviewRect(), physicalShape.SizedBox()
            );
            register.registBlock(
                'heartVisual', looksShape.SizedHeart(0xFF6666), null
            );
            register.registBlock(
                'tear', looksShape.SizedTear(), looksShape.SizedPreviewRect(), physicalShape.SizedBox()
            );
    
            register.registItem(
                '', looksShape.Circle(ITEM_RADIUS, 0x999900, 1.0), physicalShape.Circle(ITEM_RADIUS)
            );
    
            register.registBullet(
                '', looksShape.Circle(BULLET_RADIUS, 0xFF0000, 1.0),
                physicalShape.PiledCenterBox(BULLET_RADIUS*2, BULLET_RADIUS*2, BULLET_PHISICS_POW)
            );

            register.registBar(
                //マウス等操作の都合上、中心基準のrectを使用する。
                '', looksShape.CenterRect(BAR_WIDTH, BAR_HEIGHT, 0x666600, 1.0),
                physicalShape.PiledCenterBox(BAR_WIDTH, BAR_HEIGHT, BAR_PHISICS_POW)
            );
            //TODO 角を丸くしたい
            register.registBar(
                'extend', looksShape.CenterRect(BAR_WIDTH*2, BAR_HEIGHT, 0xcccc00, 1.0),
                body => {
                    //TODO ここもう少しスマートにやりたい
                    //互換性を保ちつつ可能か？
                    physicalShape.PiledCenterBox(BAR_WIDTH*2, BAR_HEIGHT, BAR_PHISICS_POW)(body);
                    return body;
                }
            );
    
            register.registLostArea(
                '', looksShape.Empty(), physicalShape.Box(0, LOSTAREA_Y, STAGE_WIDTH, LOSTAREA_THICK)
            );
    
            register.registPlayArea(
                '', looksShape.Empty(), physicalShape.RectPlayArea(STAGE_WIDTH, STAGE_HEIGHT, PLAYAREA_WALL_THICK)
            );
    
            register.registLabel('', (g, w, h) => g);
            register.registLabel('text', (g, w, h) => {
                const margin = 40;
                return g.lineStyle(0, 0x101010).beginFill(0xFFFFFF, 0.8).drawRoundedRect(-margin, -margin, w+margin*2, h+margin*2, margin).endFill();
            });
            register.registLabel('textUiren', (g, w, h) => {
                const margin = 40;
                return g.lineStyle(0, 0x101010).beginFill(0xFFFFFF, 0.8).drawRoundedRect(-margin, -margin, w+margin*2, h+margin*2, margin).endFill();
            });
            register.registLabel('frame', (g, w, h) => {
                const margin = 20;
                return g.lineStyle(5, 0xFFFFFF).beginFill(0x990000, 1).drawRoundedRect(-margin, -margin, w, h, margin).endFill();
            });
    
            register.registStyle('text', {
                fontSize: '30px',
                fill: '#101010',
                fontWeight: 'bolder',
                align: 'center',
            });
            register.registStyle('textUiren', {
                fontSize: '40px',
                fill: '#101010',
                fontWeight: 'bolder',
                //align: 'center',
            });
    
            register.registPlayerCount(
                '', g => {
                    //TODO ここもう少しスマートにやりたい
                    //互換性を保ちつつ可能か？
                    looksShape.Circle(BALL_RADIUS, 0x000000, 1.0)(g);
                    looksShape.Circle(BALL_RADIUS - 2, 0xFFFFFF, 1.0)(g);
                    return g;
                }, physicalShape.Circle(BALL_RADIUS)
            );
    
            register.registParticle('block', 1.0, 20, looksShape.TriangleParticle(6, 3, [0xCCAAAA, 0xAACCAA, 0xAAAACC]),
            () => ({
                x: [0, Math.random()*200-100, tween.CubicOut],
                y: [0, Math.random()*200-100, tween.CubicOut],
                alpha: [1.0, 0.0, tween.CubicIn],
                rotation: [Math.random()*Math.PI*2, Math.random()*Math.PI*2, tween.CubicOut],
            }));

            register.registParticle('clear', 4.0, 40, looksShape.TriangleParticle(6, 3, [0xFFCCCC, 0xCCFFCC, 0xCCCCFF]),
            () => ({
                x: [0, Math.random()*400-200, tween.CubicOut],
                y: [0, Math.random()*400-200, tween.CubicOut],
                alpha: [1.0, 0.0, tween.CubicIn],
                rotation: [Math.random()*Math.PI*2, Math.random()*Math.PI*2, tween.CubicOut],
            }));
    
            register.registParticle('bar', 2.0, 40, looksShape.TriangleParticle(6, 3, [0x6666CC, 0x666633, 0x666600]),
            () => ({
                x: [0, Math.random()*600-300, tween.CubicOut],
                y: [0, Math.random()*20-10, tween.CubicOut],
                alpha: [1.0, 0.0, tween.CubicIn],
                rotation: [Math.random()*Math.PI*2, Math.random()*Math.PI*2, tween.CubicOut],
            }));
    
            register.registParticle('ball', 0.5, 10, looksShape.CircleParticle(4, 2, [0x606000, 0x006060, 0x600060]),
            () => ({
                x: [0, Math.random()*100-50, tween.CubicOut],
                y: [0, Math.random()*100-50, tween.CubicOut],
                alpha: [1.0, 0.0, tween.CubicIn],
                rotation: [0, 0, tween.Nop],
            }));
    
            register.registTween('block',
                0.5,
                tween.Sin, 6.0,
                tween.Sin, 7.0,
                tween.CubicOut, 8.0, 0.0,
                tween.CubicOut, 0.8, 1.0 //alphaの開始は0.1未満にすると、xとyが効かなくなる
            );
            register.registTween('flash',
                0.5,
                tween.Nop, 0.0,
                tween.Nop, 0.0,
                tween.Nop, 0.0, 0.0,
                tween.CosPositive, 0.5, 3.5
            );
            register.registTween('alphaOff',
                0.5,
                tween.Nop, 0.0,
                tween.Nop, 0.0,
                tween.Nop, 0.0, 0.0,
                tween.CubicOut, 1.0, 0.0
            );
            register.registTween('alphaOffSlow',
                1.0,
                tween.Nop, 0.0,
                tween.Nop, 0.0,
                tween.Nop, 0.0, 0.0,
                tween.CubicIn, 1.0, 0.0
            );
        },
        preLoadFunction: function(shape, store, factory, event, command, behavior, helper, asset){
        },
        stageBuilderFunction: function(shape, store, factory, event, command, behavior, helper, asset){

            //イベント発火確認
            //#region
            event.Hit.addListener(new (function(){
                this.fired = function(block){ console.log('hitEvent block:'+block.id()); };
            })());
            event.HitBallBar.addListener(new (function(){
                this.fired = function(ball, bar){ console.log('hitBallBarEvent ball:'+ball.id()+' bar:'+bar.id()); };
            })());
            event.HitBullet.addListener(new (function(){
                this.fired = function(block, bullet){ console.log('hitBulletEvent block:'+block.id()+' bullet:'+bullet.id()); };
            })());
            event.Break.addListener(new (function(){
                this.fired = function(block){ console.log('breakEvent block:'+block.id()); };
            })());
            event.LostBall.addListener(new (function(){
                this.fired = function(ball){ console.log('lostBallEvent ball:'+ball.id() + ' count:'+store.Ball.count()); };
            })());
            event.GetItem.addListener(new (function(){
                this.fired = function(item){ console.log('getItemEvent item:'+item.id()); };
            })());
            event.LostItem.addListener(new (function(){
                this.fired = function(item){ console.log('lostItemEvent item:'+item.id()); };
            })());
            event.Tap.addListener(new (function(){
                this.fired = function(){ console.log('stageTapEvent'); };
            })());
            event.LabelTap.addListener(new (function(){
                this.fired = function(label){ console.log('event.LabelTap label:'+label.id()); };
            })());
            event.BarDrag.addListener(new (function(){
                this.fired = function(x, y){ /*console.log('stageDragEvent x:'+x+' y:'+y);*/ };
                this.stoped = function(){ console.log('BarDrag stoped'); };
            })());
            event.ImageDrag.addListener(new (function(){
                this.fired = function(x, y){ /*console.log('stageDragEvent x:'+x+' y:'+y);*/ };
                this.stoped = function(){ console.log('ImageDrag stoped'); };
            })());
            event.BreakPlayer.addListener(new (function(){
                this.fired = function(){ console.log('breakPlayerEvent'); };
            })());
            event.Clear.addListener(new (function(){
                this.fired = function(message){ console.log('event.Clear '+message); };
            })());
            event.Fail.addListener(new (function(){
                this.fired = function(){ console.log('event.Fail'); };
            })());
            //#endregion

            const BALL_SPLIT_LIMIT = 100;
            const BALL_SPLIT = 4;
            const BULLET_VELOCITY = [0, -1000];
            const ITEM_DROP_SPEED = 500;
                    
            command.FadeScreen.execAsync(0xFFFFFF, shape.Tween('alphaOffSlow'), false).catch(()=>{});

            const playArea = factory.PlayArea.createPlayArea(shape.PlayArea());
            const lostArea = factory.LostArea.createLostArea(shape.LostArea());
            const image = ['haikei01.jpg', 'haikei02.jpg', 'uiren01.jpg', 'uiren02.png']
                .map(path => ({[path]: factory.Image.createImage(path)}))
                .reduce((acc, cur) => Object.assign(acc, cur), {});
            const face = factory.Block.createBlock(shape.Block('visualOnly'), 300, 150);
            const label = factory.Label.createLabel();
            const gameLabel = factory.Label.createLabel();
            command.PutBlock.exec(face, 400, 100);
            command.ChangeBlockMaskImage.exec(face, 'uiren01.jpg');
            command.DrawText.exec(label, "海いこ～？", 700, 100, 'left', '', shape.Label('textUiren'), shape.Style('textUiren'));
            
            let seihukuBreaked = 0;
            const seihukus = [
                            [400, 250], [500, 250], [600, 250],
                [300, 450], [400, 450], [500, 450], [600, 450], [700, 450],
                [300, 500], [400, 500], [500, 500], [600, 500], [700, 500], 
            ].map((xy, i) => {
                const b = factory.Block.createBlock(shape.Block('block'), 100, 50);
                command.PutBlock.exec(b, xy[0], xy[1]);
                behavior.HitCountBreak.exec(b, 1);
                command.ChangeBlockMaskImage.exec(b, 'uiren01.jpg');
                //海に到着
                behavior.BreakEventCallback.exec(b, ()=>{
                    seihukuBreaked++;
                    if(seihukuBreaked < seihukus.length) return;
                    command.ChangeImage.exec(0, image['haikei02.jpg']);
                    command.BreakBlock.exec(face);
                    mizugis.forEach(m => {
                        behavior.HitCountBreak.exec(m, 1);
                        //TODO 水着画像の方が大きい場合に隠しきれない。何とかしたい。
                        command.ChangeBlockMaskImage.exec(m, 'uiren03.jpg');
                    });
                    command.DrawText.exec(label, "海だ～！！", 400, 100, 'right', '', shape.Label('textUiren'), shape.Style('textUiren'));

                    command.Timeout.execAsync(null, 1.0, false)
                    .then(()=>{
                        const bl = store.Ball.getRandomOne();
                        if(bl != null){
                            command.SplitBall.exec(bl, shape.Ball(), BALL_SPLIT_LIMIT, BALL_SPLIT);
                        }        
                    });
                });
                //ラベル消し
                behavior.BreakEventCallback.exec(b, ()=>{
                    if(seihukuBreaked != 2) return;
                    command.ChangeLabel.exec(label, shape.Label(), 0, 0);                    
                });
                behavior.BreakEventCallback.exec(b, ()=>{
                    command.ParticleBlock.exec(b, shape.Particle('block'));
                });
                //分裂
                if(i == 3 || i == 7){
                    behavior.BreakEventCallback.exec(b, ()=>{
                        const bl = store.Ball.getRandomOne();
                        if(bl != null){
                            command.SplitBall.exec(bl, shape.Ball(), BALL_SPLIT_LIMIT, BALL_SPLIT);
                        }    
                    });
                }
                return b;
            });
            let mizugiHit = 0;
            let mizugiBreaked = 0;
            const mizugis = [
                            [400, 300], [500, 300], [600, 300],
                            [400, 350], [500, 350], [600, 350],
                            [400, 400], [500, 400], [600, 400],
                [300, 550], [400, 550], [500, 550], [600, 550],
                [300, 600], [400, 600], [500, 600], [600, 600],
                [300, 650], [400, 650], [500, 650], [600, 650],
                            [400, 700], [500, 700], [600, 700],
            ].map((xy, i) => {
                const b = factory.Block.createBlock(shape.Block('block'), 100, 50);
                command.PutBlock.exec(b, xy[0], xy[1]);
                command.ChangeBlockMaskImage.exec(b, 'uiren01.jpg');
                behavior.HitBallEventCallback.exec(b, (_b, ba)=>{
                    command.ChangeBallAngle.exec(ba, deg => {
                        //ボールが垂直水平にならないように
                        var delta = 15;
                        if(deg <= -180 + delta) return -180 + delta;
                        if(180 - delta <= deg) return 180 - delta;
                        if(-90 - delta <= deg && deg <= -90) return -90 - delta;
                        if(-90 <= deg && deg <= -90 + delta) return -90 + delta;
                        if(90 - delta <= deg && deg <= 90) return 90 - delta;
                        if(90 <= deg && deg <= 90 + delta) return 90 + delta;
                        if(-delta <= deg && deg <= 0) return -delta;
                        if(0 <= deg && deg <= delta) return delta;
                        return deg;
                    });
                });
                //ラベル消し
                behavior.BreakEventCallback.exec(b, ()=>{
                    mizugiBreaked++;
                    if(mizugiBreaked != 15) return;
                    command.ChangeLabel.exec(label, shape.Label(), 0, 0);                    
                });
                behavior.BreakEventCallback.exec(b, ()=>{
                    command.ParticleBlock.exec(b, shape.Particle('block'));
                });
    
                return b;
            });

            behavior.LostItemBreak.exec();
            behavior.LostBulletBreak.exec();
            behavior.ExertItem.exec();
            behavior.ReleaseBall.exec();
            behavior.BindedBarBallStart.exec();
            behavior.HitBarBallSpeedUpAndLimit.exec(1.005, 1000);
            behavior.HitBulletToHitBlock.exec();
            behavior.LostBallBreakPlayer.exec(shape.Particle('ball'), shape.Particle('bar'));
            behavior.AllBreakClear.exec('start');
            behavior.PlayerLeftFailRestart.exec(3.0, 3.0);

            //クリア
            behavior.ClearEventCallback.exec(()=>{
                command.DrawText.exec(label, "泳ご～！！", 400, 100, 'right', '', shape.Label('textUiren'), shape.Style('textUiren'));
                command.Timeout.execAsync(null, 5.0, false)
                    .then(()=>{
                        command.ChangeLabel.exec(label, shape.Label(), 0, 0);
                    });
                command.Timeout.execAsync(null, 0.5, false)
                    .then(()=>{
                        command.ParticlePoint.exec(700, 400, shape.Particle('clear'));
                        return command.Timeout.execAsync(null, 0.5, false)
                    })
                    .then(()=>{
                        command.ParticlePoint.exec(400, 200, shape.Particle('clear'));
                        return command.Timeout.execAsync(null, 0.5, false)
                    })
                    .then(()=>{
                        command.ParticlePoint.exec(500, 300, shape.Particle('clear'));
                        return command.Timeout.execAsync(null, 0.5, false)
                    })
                    .then(()=>{
                        command.ParticlePoint.exec(800, 600, shape.Particle('clear'));
                        command.DrawText.exec(gameLabel, "CLEAR！！", STAGE_WIDTH/2, STAGE_HEIGHT/2, 'center', '', shape.Label('text'), shape.Style('text'));
                        command.Tappable.exec(gameLabel);
                        behavior.LabelTapEventCallback.exec(gameLabel, ()=>{
                            command.ChangeLabel.exec(gameLabel, shape.Label(), 0, 0);
                        });                    
                        return command.Timeout.execAsync(null, 0.5, false)
                    })
            });

            //ゲームオーバー
            behavior.FailEventCallback.exec(()=>{
                command.DrawText.exec(gameLabel, "GAME OVER\r\rここをクリックしてリスタート", STAGE_WIDTH/2, STAGE_HEIGHT/2, 'center', '', shape.Label('text'), shape.Style('text'));
                command.Tappable.exec(gameLabel);
                behavior.LabelTapEventCallback.exec(gameLabel, ()=>{
                    behavior.ImmediateStageClear.exec();
                    command.GameClear.exec('start');
                });
                    
            });


            command.ChangeImage.exec(0, image['haikei01.jpg']);
            command.ChangeImage.exec(1, image['uiren02.png']);

            command.GameStart.exec();
        },
    };
};
