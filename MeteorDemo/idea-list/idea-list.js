// 客户端&服务器端分别定义数据库ideas集合（类似关系数据库table）
Ideas = new Mongo.Collection("ideas");
/** 客户端执行代码 **/
if (Meteor.isClient) {
  // Session表示客户端一个全局存储单元
  Session.setDefault('counter', 0);
  Session.setDefault('up_counter', 2);

  // 定义helpers模板，负责将数据传到html页面（对应模板标签）
  Template.hello.helpers({
    // 获得计数器数据
    counter: function () {
      return Session.get('counter');
    },
    
    // 获得所有创意数据
    all_ideas: function(){
     // 排序-1降序,1升序
     return Ideas.find({},{sort:{score:-1}});
    }
  });
  
  // 定义事件模板，负责事件处理
  Template.hello.events({
    // hello事件模板中，点击button响应
    'click button': function () {
      // 点击时counter做加1操作
      Session.set('counter', Session.get('counter') + 1);
      // Ideas集合新添加一条文档{"score":xxx}
      Ideas.insert({"score":Session.get('counter')});
    },
    
    
    'click li':function(){
      var upCounter = Session.get("up_counter");
      // 限制为2次点击，文档每更新一次，Ideas集合做排序，并同步到server端db
      if(upCounter > 0){
	Ideas.update(this._id,{$inc:{score:1}});
        Session.set("up_counter",--upCounter);	
      }      
    }
  });
  
  // 定义form事件模板
  Template.form.events({
    'click button': function(event) {
      // 点击button阻止form事件处理
      event.preventDefault();
      // jquery库获取input文本标签数据，并写入数据库
      var idea_name = $("input[type=text]").val();
      Ideas.insert({
        name: idea_name,
        score: 0
      });
    }
  });
}

/** 服务器端执行代码 **/
if (Meteor.isServer) {
  Meteor.startup(function () {
        // 服务器启动时执行
	console.log("Server startup");
        // Ideas集合中没有数据，进行DB初始化
	if(Ideas.find().count() == 0){
		var names = [
		"8个小时做一个 Facebook",
		"8个小时做一个 Google",
		"8个小时做一个 Mifit"
	];
	
	// underscorejs库，集合迭代插入数据库
	_.each(names,function(name){

		Ideas.insert({
			name:name,
			score:0
  		})
	})
	}
	
 });
}

console.log("Client & Server executed");
