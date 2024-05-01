module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            hospital_id:{
                type: Sequelize.INTEGER
            }
        },
        {
            timestamps: false
        }
    );

    return User;
};