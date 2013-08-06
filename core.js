var database = {};
//
//users = {1:{name:"Pankaj"},2:{name:"Satish"},3:{name:"Aman"}}

//ideas = {1:{title:"import export",user:3},
//         2:{title:"activity network",user:1},
//        }


var Pongodb = {};

Pongodb.initDocument = function(type)
{
  if(database[type])//if already document type exists
  {
    return false;
  }
  database[type] = {};
  database[type]['records'] = {};
  database[type]['lastId'] = 0;

}

Pongodb.generateId = function(type)
{
  database[type]['lastId'] = database[type]['lastId'] + 1;
  return database[type]['lastId'] ;

}


Pongodb.add = function(record,type)
{

   database[type]['records'].push( _.clone(record) );
}


Pongodb.remove = function(record,type)
{
	
	//TODO: revise it so that the clone of list is not made
   database[type]['records'] = _.reject(database[type]['records'],function(r){

	   return record['_id'] == r['_id'];
   
   })

}



Pongodb.addReference = function(template,type)
{
   if(!Pongodb.documentExits(type))
   {
       Pongodb.initDocument(type);
   }

   database[type]['references'] = template;

}

Pongodb.documentExits = function(type){
    result = true
    if(!database[type])
    {
       result = false;
    }
    return result;

}






