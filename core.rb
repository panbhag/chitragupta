database = {};
#
#users = {1:{name:"Pankaj"},2:{name:"Satish"},3:{name:"Aman"}}

#ideas = {1:{title:"import export",user:3},
#         2:{title:"activity network",user:1},
#        }
database[:ideas] = {};



database.ideas.references = { user=>{from=>users, key=>id}}

class Pongodb

def self.initDocument type

  return false if(database[type])#if already document type exists

  database[type] = {};
  database[type]['records'] = {};
  database[type]['lastId'] = 0;


end

def self.generateId(type)
  database[type][lastId] + 1;
  database[lastId] = database[lastId] + 1;
end

end

class Commands

 def self.find(id,type)

   return database[type][records][id];
 end



 def insert (record,type)

  ref_template = database[type]['references'];
  if(ref_template)

      for(var ref_key in ref_template)

          var ref_id = record[ref_key];
          var ref_value = Commands.find(ref_id,type);
          record[ref_key] = ref_value;
      end

  end

 ##check if document exists
 if(!database[type])
 {
    Pongodb.initDocument(type);
 }

 var newId = Pongodb.generateId(type);
 record["_id"] = newId;
 database[type]['records'][newId] = record;

end

 end

end

Commands.insert({name:"Pankaj"},"users");
console.log(Commands.find(1));
