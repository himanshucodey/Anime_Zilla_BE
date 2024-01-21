Register approach







Login approach -
1. get input values from FE (req.body);
2. check values are stored in db or not
    i. if not log register first
    ii. if yes
        a. check email or password is same as db or not
           1. if no give error
           2. if yes -> login