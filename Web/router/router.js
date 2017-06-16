function hack(req,res){

	var request = require('superagent')
  var count
  var complete = 0

	function Time(socure){
		var time = 0
		socure.split(':').reverse().forEach(function(item,index){
			time += item * Math.pow(60,index)
		})
		return time
	}

	request
		.post('mooc.baiyunu.edu.cn/User/DoLogin')
		.send(req.body)
		.end(function(error,response){
      if(error){
        res.send('error')
        return
      }

      try{
  			var userId = response.headers['set-cookie'][1].substr(8,36)
      }catch(e){
        res.send('error')
        return
      }

			request
				.post('mooc.baiyunu.edu.cn/User/MyLearningList')
 				.send({currentPage:1,type:'course',userId})
				.end(function(error,response){
          if(error){
            res.send('error')
            return
          }

					var course = []

					JSON.parse(response.text).rows.forEach(item => {
						course.push(item.courseId)
					})

          count = course.length

          var date = new Date()
          var startTime = `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()} 07:26:00`

					course.forEach(function(item){
						var hack = {
							userId,
							startTime,
              courseId: item
						}

						request
							.post('mooc.baiyunu.edu.cn/CourseInfo/GetLessonList')
							.send({courseId:item})
							.end(function(error,response){
                var list = JSON.parse(response.text);

                count += list.length - 1;

								list.forEach(function(item){
									if(item.time){
										hack.lessonId = item.id
										hack.learnTime = Time(item.time)
										request
											.post('mooc.baiyunu.edu.cn/CourseLessonLearn/Save')
											.send(hack)
											.end(function(){
                        complete++
                        if(count == complete)
                          res.send('ok')
                      })
									}else{
                    count--
                    if(count == complete)
                      res.send('ok')
                  }
								})
							})
					})
				})
	})
}


module.exports = function(router){
  router.post('/hack/start',hack)
}
