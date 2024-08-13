class ApiFeatures{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }

    search(){
        const keyword=this.query.keyword?{
            name:{
                RegExp:this.querystr.keyword,
                Option:'i',
            },
        }
        :{};

        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const querycopy={...this.querystr};
        // removing some field for category
        const removeField=["keyword","page","limit"];
        removeField.forEach((key)=> delete querycopy[key]);

        // for priceing and rating filtering

        let querystr=JSON.stringify(querycopy);
        querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>'$'+key);
        this.query=this.query.find(JSON.parse(querystr));
        return this;
    }

    pagination(resultperpage){
        const current=Number(this.query.page)||1;
        const skip=resultperpage*(current-1);
        this.query=this.query.limit(resultperpage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;