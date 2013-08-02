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


var Commands = {}

Commands.find = function(id,type)
{

    return database[type]['records'][id];
}


Commands.update = function(id,data,type)
{
   var record = Commands.find(id,type);
   for(var key in data)
   {
       record[key] = data[key];
   }



}

Commands.delete = function(){

    var record = Commands.find();


}



Commands.insert = function(record,type)
{

    //check if document exists
    if(!database[type])
    {
        Pongodb.initDocument(type);
    }

  ref_template = database[type]['references'];
  if(ref_template)
  {
      for(var ref_key in ref_template)
      {
          var ref_id = record[ref_key];
          var ref_type =  ref_template[ref_key].from;
          var ref_value = Commands.find(ref_id,ref_type);
          record[ref_key] = ref_value;
      }

  }


 var newId = Pongodb.generateId(type);
 record["_id"] = newId;
 database[type]['records'][newId] = record;

}


///////////////////////////////////////////////////////////////////////////////////
/////////////  Test //////////////
/////////////////////////////////////////////////////


var ideas_references = {user:{from:"users"}}

Pongodb.addReference(ideas_references,'ideas');
Commands.insert({name:"Pankaj"},"users");
Commands.insert({title:"Movie Chalo",user:1},"ideas")
Commands.insert({title:"Organic",user:1},"ideas")
Commands.update(1,{name:"Pankaj Bhageria"},"users");
console.log(database.ideas.records);

