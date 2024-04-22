export default {
    addCollider(player, gameObject, callback) {
        this.scene.physics.add.collider(player, gameObject, callback, null, this);
    }
}