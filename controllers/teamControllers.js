
const Team = require('../models/team');


exports.getTeam  =  async (req, res) => {
    
    const team = await Team.find();
   
    res.render('team', {
        team: team,
        user:req.user,
        path: "TeamPage"
        
    });
}









