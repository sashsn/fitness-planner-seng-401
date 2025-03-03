const WeightLossPlan = require('./WeightLossPlan');
const MuscleGainPlan = require('./MuscleGainPlan');
const EndurancePlan = require('./EndurancePlan');

class PlanFactory {
    /**
     * Creates a workout plan based on type.
     */
    static createPlan(type) {
        switch(type) {
            case 'weightloss':
                return new WeightLossPlan();
            case 'musclegain':
                return new MuscleGainPlan();
            case 'endurance':
                return new EndurancePlan();
            default:
                throw new Error('Invalid plan type');
        }
    }
}

module.exports = PlanFactory;
