module.exports = (sequelize, Sequelize) => {
    const Hospital = sequelize.define("hospital",
        {
            hospital_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            hospital_name: {
                type: Sequelize.STRING
            }
        },
        {
            timestamps: false
        }
    );

    return Hospital;
};