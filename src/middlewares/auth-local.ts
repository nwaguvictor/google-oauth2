passport.use(
  new LocalStrategy(async (username, password, cb) => {
    const user = await User.findOne({ username });

    if (!user) return cb(new Error('User not found'), false);
    if (user.password !== password) return cb(new Error('Wrong password'), false);

    cb(null, user);
  })
);

passport.serializeUser((user: IUser, cb) => cb(null, user._id));

passport.deserializeUser(async (userId, cb) => {
  const user = await User.findById(userId);
  if (!user) return cb(new Error('User not verified'), false);

  cb(null, user);
});
