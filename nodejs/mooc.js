var request = require('superagent');
var input = require('readline').createInterface(process.stdin,process.stdout);

var user_config = {loginKey: 'userName,user_code'}

function Time(socure){
	var time = 0;
	socure.split(':').reverse().forEach(function(item,index){
		time += item * Math.pow(60,index);
	})
	return time;
}

function Init(user){
	request
		.post('mooc.baiyunu.edu.cn/User/DoLogin')
		.send(user)
		.end(function(error,response){
			console.log('\n  用户ID获取成功......');

			var userId = response.headers['set-cookie'][1].substr(8,36);

			request
				.post('mooc.baiyunu.edu.cn/User/MyLearningList')
				.send({currentPage:1,type:'course',userId})
				.end(function(error,response){
					console.log('\n  课程信息获取成功......');

					var course = [];

					JSON.parse(response.text).rows.forEach(function(item){
						course.push({
							title: item.title,
							id: item.courseId
						})
					})

					course.forEach(function(item){
						var hack = {
							userId,
							courseId: item.id,
							startTime: '2017-04-12 12:00:00'
						}

						request
							.post('mooc.baiyunu.edu.cn/CourseInfo/GetLessonList')
							.send({courseId:item.id})
							.end(function(error,response){
								JSON.parse(response.text).forEach(function(item){
									if(item.time){
										hack.lessonId = item.id;
										hack.learnTime = Time(item.time);
										request
											.post('mooc.baiyunu.edu.cn/CourseLessonLearn/Save')
											.send(hack)
											.end(function(){
												console.log('\n  已解决：' + item.title);
											})
									}
								})
							})
					})
				})
		})
}

input.question('\n  请输入用户名:  ',function(username){
	user_config.userName = username;
	input.question('\n  请输入密码(123456):  ',function(password){
		user_config.password = password||123456;
		input.close();
	})
})

input.on('close',function(){
	Init(user_config);
})
