import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import supabase from './supabase.js';

export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const avatarUrl = profile.photos[0].value;

        try {
          let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', googleId)
            .single();

          if (!user) {
            let { data: emailUser } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single();

            if (emailUser) {
              const { data: updatedUser } = await supabase
                .from('users')
                .update({ google_id: googleId, avatar_url: avatarUrl })
                .eq('id', emailUser.id)
                .select()
                .single();
              user = updatedUser;
            } else {
              const { data: newUser } = await supabase
                .from('users')
                .insert([{ full_name: fullName, email, google_id: googleId, avatar_url: avatarUrl }])
                .select()
                .single();
              user = newUser;
            }
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
