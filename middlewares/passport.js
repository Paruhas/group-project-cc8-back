const { Strategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
const passport = require("passport");

const options = {
  secretOrKey: process.env.JWT_SECRET, // secretKey คืออะไร
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // วิธีแกะตัว Authenticate (เราใช้ Bearer)
};

const JwtStrategy = new Strategy(options, async (payload, done) => {
  // new Strategy ไป verify ตัว Toekn ให้เรา ถ้าถูกต้อง/ผ่านหมด => valid แล้วจะไปทำงานส่วน verify Callback (ก้อนที่ใส่ async) ; ไม่ผ่านส่ง unauthorize ออกมา
  try {
    const user = await User.findOne({ where: { id: payload.id } }); // เมื่อได้ payload แล้ว ไปหา user ในระบบ ว่ามีตรงกับ payload.id ไหม
    if (!user) return done(null, false); // ไม่มีส่ง error(จากการuserไม่เจอ) ออกไป โดยใช้ doneFn params ( ส่ง null ออกไป , req.user = false ); unauthorize
    done(null, user); // ส่ง done ออกไปแล้ว modifier req OBJ โดยจะทำการ req.user = user
  } catch (err) {
    done(err, false); // เป็น internal error
  }
});
// เมื่อทำสำเร็จ ส่ง payload เข้าไปใน Callback Fn ; และ Callback Fn done จะเข้าไปเรียกใน Strategy อีกทีนึง
// payload มีอะไรบ้างก็ตามที่เราใช้ Fn JWT .sign ในการทำ payload ขึ้นมา

passport.use("jwt", JwtStrategy); // กำหนดชื่อให้กับ Strategy ; ให้ชื่อ Strategy เป็น jwt
