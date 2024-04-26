export default anims => {

    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {start: 0, end: 1}),
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
        frames: anims.generateFrameNumbers('player', {start: 6, end: 6}),
        frameRate: 2,
        repeat: -1,
    })

    anims.create({
        key: 'die',
        frames: anims.generateFrameNumbers('player', {start: 1, end: 1}),
        frameRate: 2,
        repeat: -1,
    })


}