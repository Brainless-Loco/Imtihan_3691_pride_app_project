import db from "./database.js";

export async function getProfileByUserId(userId) {
  const [rows] = await db.query(
    "SELECT * FROM user_profiles WHERE user_id = ?",
    [userId]
  );
  return rows[0] || null;
}

export async function saveProfile(profile) {
  const {
    user_id,
    full_name,
    pronouns,
    age,
    location,
    stem_specialization,
    research_idea,
    professional_focus,
    passion_topic,
    community,
    resume_file_name,
    resume_base64,
  } = profile;

  const [existing] = await db.query(
    "SELECT id FROM user_profiles WHERE user_id = ?",
    [user_id]
  );

  if (existing.length) {
    await db.query(
      `UPDATE user_profiles
       SET full_name=?, pronouns=?, age=?, location=?, stem_specialization=?,
           research_idea=?, professional_focus=?, passion_topic=?, community=?,
           resume_file_name=?, resume_base64=?, profile_complete=1
       WHERE user_id=?`,
      [
        full_name,
        pronouns,
        age,
        location,
        stem_specialization,
        research_idea,
        professional_focus,
        passion_topic,
        community,
        resume_file_name,
        resume_base64,
        user_id,
      ]
    );
  } else {
    await db.query(
      `INSERT INTO user_profiles
       (user_id, full_name, pronouns, age, location, stem_specialization,
        research_idea, professional_focus, passion_topic, community,
        resume_file_name, resume_base64, profile_complete)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        user_id,
        full_name,
        pronouns,
        age,
        location,
        stem_specialization,
        research_idea,
        professional_focus,
        passion_topic,
        community,
        resume_file_name,
        resume_base64,
      ]
    );
  }

 

  
}

export async function getProfileInfo(id){
    try{
      const [rows] = await db.execute(
      "SELECT name, account_type, pronouns, role, company, age, location, interests, tags, bio FROM user_profiles WHERE user_id = ?",
      [id]
      );

      return rows[0];
    }
    catch(err){
      return null;
    }
}
