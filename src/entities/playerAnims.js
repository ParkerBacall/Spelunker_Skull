export default anims => {

    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {start: 16, end: 17}),
        frameRate: 2,
        repeat: -1,
    })


    anims.create({
        key: 'run',
        frames: anims.generateFrameNumbers('player', {start: 2, end: 5}),
        frameRate: 6,
        repeat: -1,
    })

    anims.create({
        key: 'jump',
        frames: anims.generateFrameNumbers('player', {start: 20, end: 20}),
        frameRate: 2,
        repeat: -1,
    })


}