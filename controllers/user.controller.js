import User from "../models/user.model.js";

const getDecodedToken = (req, res) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
    
        if (!user) {
          const error = new Error('User not found');
          error.statusCode = 404;
          throw error;
        }
    
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        next(error);
      }
}

export const deleteUser = async (req, res, next) => {
    try {
        const decoded = getDecodedToken(req, res);

        if ( decoded.userId !== req.params.id){
            const error = new Error("User can not delete another user's information");
            error.statusCode = 404;
            throw error;
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
          const error = new Error('User not found');
          error.statusCode = 404;
          throw error;
        }
    
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        next(error);
      }
}

export const updateUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const decoded = getDecodedToken(req, res);
    try {
        if ( decoded.userId !== req.params.id){
            const error = new Error("User can not edit another user's information");
            error.statusCode = 404;
            throw error;
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
          const error = new Error('User not found');
          error.statusCode = 404;
          throw error;
        }
        
        await session.commitTransaction();
        session.endSession();
    
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
      }
}