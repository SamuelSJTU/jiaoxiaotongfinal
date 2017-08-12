var builder = require("botbuilder");
var createCards = new Object();


var cardsName = ["cardShuttle","cardBus","cardAnthem","cardLibrary","cardCanteen","cardHelp","cardBing","cardDishC5","cardDishC5Noodles"]
isCard = function(str){
    if(cardsName.indexOf(str)!=-1) return true;
    else return false;
}
createCards["cardShuttle"] = function(session){
    var card =  new builder.HeroCard(session)
    .title('校车')
    .subtitle('闵行校区与徐汇校区往返')
    .text('徐汇至闵行：06：45-21：30；闵行至徐汇：06：40-20：40')
    .images([
        builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4354/35662912334_7a21f2b096_b.jpg')
    ])
    .buttons([
        builder.CardAction.openUrl(session, 'http://houqin.sjtu.edu.cn/sview.asp?id=158', '查看时刻表')
        
    ]);
    // attach the card to the reply message
    return new builder.Message(session).addAttachment(card);
}


createCards["cardBus"] = function(session){
    var card = new builder.HeroCard(session)
        .title('校园巴士')
        .subtitle('菁菁堂广场始发')
        .text('闵行校区校园巴士为环线运营，工作日：07：30-20：10。')
        .images([
            builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4373/35643731714_3a94ec264c_b.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'http://houqin.sjtu.edu.cn/sview.asp?id=158', '巴士时刻表')
        ]);
    // attach the card to the reply message
    return new builder.Message(session).addAttachment(card);
}


createCards["cardAnthem"] = function(session){
    var card = new builder.AudioCard(session)
    .title('上海交通大学校歌')
    .subtitle('王于之词，瞿维曲')
    .text('相聚在东海之滨，汲取知识的甘泉。迎向那真理之光，扬起青春的风帆。')
    .image(builder.CardImage.create(session, 'http://c1.staticflickr.com/5/4382/36362980721_aa940bf4f4.jpg'))
    .media([
        { url: 'https://od.lk/s/ODdfNjYzODQ5Nl8/%E4%B8%8A%E6%B5%B7%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A62009%E7%89%88%E6%A0%A1%E6%AD%8C.mp3' }
    ])
    .buttons([
        builder.CardAction.postBack(session, '校歌歌词', '查看歌词'),
        builder.CardAction.openUrl(session, 'http://www.sjtu.edu.cn/xiaoli/xlactivitycontent.jsp?urltype=news.NewsContentUrl&wbtreeid=1253&wbnewsid=55762', '查看新版校歌《栋梁》')
    ]);   
    // attach the card to the reply message
    return new builder.Message(session).addAttachment(card);
}

createCards["cardLibrary"] = function(session){
    var cards = [
        new builder.HeroCard(session)
            .title('图书馆主馆')
            .subtitle('开放时间：周日至周四08:00-23:00，周五至周六08:00-22:00')
            .text('理工生医农综合馆，服务面积约为3.5万平方米，座位近4000席。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4388/35689996623_1b6424a085_b.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '预定图书馆主馆自习室', '预定自习室'),
                builder.CardAction.postBack(session, '图书馆主馆怎么去', '带我去')
            ]), 
            new builder.HeroCard(session)
            .title('包玉刚图书馆')
            .subtitle('开放时间：08:00-22:00')
            .text('人文社科综合馆，总藏书量约为72万册，阅览座位约1200席。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4337/36101653700_d0ba248ff9_b.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '预定包玉刚图书馆自习室', '预定自习室'),
                builder.CardAction.postBack(session, '包玉刚图书馆怎么去', '带我去')
            ]),
            new builder.HeroCard(session)
            .title('李政道图书馆')
            .subtitle('开放时间：08:00-22:00')
            .text('最大藏书容量约为7万册书刊，共有300余个阅览座位，5个小组讨论室')
            .images([
                builder.CardImage.create(session, 'http://c1.staticflickr.com/5/4394/36498512535_37f0b102f0_b.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '预定李政道图书馆自习室', '预定自习室'),
                builder.CardAction.postBack(session, '李政道图书馆怎么去', '带我去')
            ])
        ];
     // create reply with Carousel AttachmentLayout
     return new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
}

createCards["cardCanteen"] = function(session){
    var cards = [
        new builder.HeroCard(session)
            .title('第一食堂大楼')
            .subtitle('早餐7：00-8：30；午餐11：00-13：00；晚餐 16：30-19：00')
            .text('位于思源南路与思源西路交汇处，主要服务西区三栋教学楼和一期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4397/36378776381_5d3e25e249.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '一餐招牌菜', '招牌菜'),
                builder.CardAction.postBack(session, '一餐怎么去', '带我去')
            ]), 
            new builder.HeroCard(session)
            .title('第二食堂大楼')
            .subtitle('早餐7：00-8：30；午餐11：00-13：00；晚餐 16：30-19：00')
            .text('位于东区大转盘以东，思源南路与学森路交汇处，主要服务东区三栋教学楼二期、三期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4387/36378776271_8747828c55.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '二餐招牌菜', '招牌菜'),
                builder.CardAction.postBack(session, '二餐怎么去', '带我去')
            ]), 
            new builder.HeroCard(session)
            .title('第三食堂大楼')
            .subtitle('早餐7：00-8：30；午餐11：00-13：00；晚餐 16：30-19：00')
            .text('位于思源北路与文俊路交汇处，主要服务四、五期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4391/36378776141_369ae58932.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '三餐招牌菜', '招牌菜'),
                builder.CardAction.postBack(session, '三餐怎么去', '带我去')
            ]), 
            new builder.HeroCard(session)
            .title('第四食堂大楼')
            .subtitle('早餐7：00-10：00；午餐11：00-12：00；晚餐 16：30-18：30')
            .text('位于南洋北路与南阳西路交汇处，主要服务六、七期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4384/35708459923_72d3bbb0fb.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '四餐招牌菜', '招牌菜'),
                builder.CardAction.postBack(session, '四餐怎么去', '带我去')
            ]),
            new builder.HeroCard(session)
            .title('第五食堂大楼')
            .subtitle('早餐7：00-10：00；午餐11：00-12：00；晚餐 16：30-18：30')
            .text('位于南洋南路与思源西路交汇处，主要服务电源群楼。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4407/36378776481_aa983e608d.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '五餐招牌菜', '招牌菜'),
                builder.CardAction.postBack(session, '五餐怎么去', '带我去')
            ])
        ];
     // create reply with Carousel AttachmentLayout
     return new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
}

createCards["cardDishC5Noodles"] = function(session){
    var cards = [
            new builder.HeroCard(session)
            .title('铁板炒面')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4363/36516745835_0792a4e10d.jpg')
            ]), 
            new builder.HeroCard(session)
            .title('意大利面')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4434/36470223146_98d28bebbf.jpg')
            ])
        ];
     // create reply with Carousel AttachmentLayout
     return new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
}

createCards["cardDishC5"] = function(session){
    var cards = [
        new builder.HeroCard(session)
            .title('小龙虾')
            .subtitle('早餐7：00-8：30；午餐11：00-13：00；晚餐 16：30-19：00')
            .text('位于思源南路与思源西路交汇处，主要服务西区三栋教学楼和一期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4435/36348605702_a015c0a11c.jpg')
            ]), 
            new builder.HeroCard(session)
            .title('铁板炒面')
            .subtitle('早餐7：00-8：30；午餐11：00-13：00；晚餐 16：30-19：00')
            .text('位于东区大转盘以东，思源南路与学森路交汇处，主要服务东区三栋教学楼二期、三期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4363/36516745835_0792a4e10d.jpg')
            ]), 
            new builder.HeroCard(session)
            .title('')
            .subtitle('早餐7：00-8：30；午餐11：00-13：00；晚餐 16：30-19：00')
            .text('位于思源北路与文俊路交汇处，主要服务四、五期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4434/36470223146_98d28bebbf.jpg')
            ]), 
            new builder.HeroCard(session)
            .title('麻辣香锅')
            .subtitle('早餐7：00-10：00；午餐11：00-12：00；晚餐 16：30-18：30')
            .text('位于南洋北路与南阳西路交汇处，主要服务六、七期学生公寓。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4353/36379196301_b16df3b997.jpg')
            ]),
            new builder.HeroCard(session)
            .title('小火锅')
            .subtitle('早餐7：00-10：00；午餐11：00-12：00；晚餐 16：30-18：30')
            .text('位于南洋南路与思源西路交汇处，主要服务电源群楼。')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4365/36348605502_7aac0fbf17.jpg')
            ])
        ];
     // create reply with Carousel AttachmentLayout
     return new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
}


//bing搜索结果card框架，需替换title和按钮对应的链接。

createCards["cardBing"] = function(session,webPages){
    var cards = [];
    for(var i=0;i<webPages.length;i++){
        if(i>2) break;
        var card = new builder.HeroCard(session)
            .title(webPages[i].name)
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4436/35665164854_fe9514be35.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, webPages[i].url, '详细信息'),
            ]);
            cards.push(card);

    }
     // create reply with Carousel AttachmentLayout
     return new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
}

//回复“功能”、“help”
createCards["cardHelp"] = function(session){
    var cards = [
        new builder.HeroCard(session)
            .title('知识问答')
            .subtitle('')
            .text('')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4375/36454877256_48887e899f_c.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '交大男女比例有多少', '交大男女比例有多少'),
                builder.CardAction.postBack(session, '教务处网址是什么', '教务处网址是什么'),
                builder.CardAction.postBack(session, '交大哪个学院规模最大', '交大哪个学院规模最大')
            ]), 
            new builder.HeroCard(session)
            .title('即兴闲聊')
            .subtitle('')
            .text('')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4371/36454877026_c355bc33b6_c.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '给我唱首歌', '给我唱首歌'),
                builder.CardAction.postBack(session, '说个好玩的笑话', '讲个笑话吧'),
                builder.CardAction.postBack(session, '我饿了', '我饿了')
            ]), 
            new builder.HeroCard(session)
            .title('课程/考试查询')
            .subtitle('')
            .text('')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4365/36454876766_13f176be14_c.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '编译原理在哪里上课', '编译原理在哪里上课'),
                builder.CardAction.postBack(session, '高数1考场在哪里', '高数1考场在哪里'),
                builder.CardAction.postBack(session, '交大有机器学习相关的课吗', '机器学习相关的课')
            ]), 
            new builder.HeroCard(session)
            .title('出行导航')
            .subtitle('')
            .text('')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4439/36454876516_43710c208c_c.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '东川路站怎么走', '怎么去东川路站'),
                builder.CardAction.postBack(session, '思源门怎么走', '怎么去思源门'),
                builder.CardAction.postBack(session, '东下院到二餐怎么走', '东下院到二餐怎么走')
            ]),
         new builder.HeroCard(session)
            .title('美食推荐')
            .subtitle('')
            .text('')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4352/36454876156_e8b98c47af_c.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '学校里有什么好吃的', '学校里有什么好吃的'),
                builder.CardAction.postBack(session, '我想吃点辣的', '我想吃点辣的'),
                builder.CardAction.postBack(session, '学校附近有什么好吃的', '校外有什么好吃的')
            ]), 
         new builder.HeroCard(session)
            .title('日程提醒')
            .subtitle('')
            .text('')
            .images([
                builder.CardImage.create(session, 'https://c1.staticflickr.com/5/4390/35666163694_05a71b9a5b_c.jpg')
            ])
            .buttons([
                builder.CardAction.postBack(session, '下一个日程', '我接下来有什么事？'),
                builder.CardAction.postBack(session, '添加日程', '添加日程')
            ])
        ];
     // create reply with Carousel AttachmentLayout
     return new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
}

// createCards

module.exports.createCards = createCards;
module.exports.cardsName = cardsName;
module.exports.isCard = isCard;
/**
 * 使用样例
 * 根据名字发送对应card的信息
 *         for(var i=0;i<cards.cardsName.length;i++){
 *           var msg = cards.createCards[cards.cardsName[i]](session);  // 返回card生成的msg
 *           session.send(msg);
 *          }
 *       
 * 
 */