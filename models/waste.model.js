module.exports = (sequelize, Sequelize) => {
    const Waste = sequelize.define("waste",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            waste_name: {
                type: Sequelize.STRING
            },
            possibility:{
                type: Sequelize.FLOAT
            },
            date:{
                type: Sequelize.DATE
            },
            hospital_id: {
                type: Sequelize.INTEGER
            }

        },
        {
            timestamps: false
        }
    );

    return Waste;
};