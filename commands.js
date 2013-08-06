
var Commands = {}


function selector(type,value,condition)
{ 
   var result;
			switch(type)
			{
				case "ne:
				  result = value != condition;
				  break;
				case "lt":
				  result = value < condition;
				  break;
				case "lte":
				  result = value <= condition;
				  break;
				case "gt":
				  result = value > condition;
				  break;
				case "gte":
				  result = value > condition;
				  break;
				case "in":
				  result = _.contains(condition, value);
				case "nin":
				  result = !(_.contains(condition, value) );
				case "all":
					//value and condition should an array
				   result = _.difference(condition, value).length == 0;
				case "or":
					//value should an array
				   var conditions_array = condition;
				    result = _.some(conditions_array,function(c){
					
						var i_result = compare(value,c);
						return i_result;
				   });
				 case "and":
					//value should an array
				   var conditions_array = condition;
				    result = _.every(conditions_array,function(c){
								var i_result = compare(value,c);
								return i_result;
								});
				 case "nor": // every condition should be false
				   var conditions_array = condition;
				    result = _.every(conditions_array,function(c){
						var i_result = !compare(value,c);
						return i_result;
				   });
				 case "not":

					result = !compare(value,condition);
				 case "exists":
					 //this will not work as the x[y] is null if y is there or not, have to change design a little
				 case "elemMatch": //one of the elements of array should match this
					 //value is an array
					result = _.some(value,function(v){
						var i_result = compare(v,condition);
						return i_result;
				   });	
				  case 'size': //check the size of array
					  //value is an array
					  result = value.length == condition;
				  case 'regex': 
					  result = condition.test(value);
				  case 'where'://condition is a function
				  {
					  result = condition(value);
				  }

	              default:
				  console.log("filter $" + filter + "is not defined");
				  result = false;
			}

			return result;
}


function compare(object,conditions)
{
	result = true;
	
    for(key in conditions)
	{
		
		//check if key is $
		if(key[0] == "$")
		{
			var filter = key.substring(1);
			result = selector(filter,object,conditions[key]);
			break;
		}
		
		
		if(_.isObject(conditions[key]))
		{
			result = compare(object[key],conditions[key])

		}
		else
		{
		   result = object[key] == conditions[key]
		}
		
		if(!result)
		{break;}
	}
	return result;

}

function where(list,conditions)
{
	var result = _.filter(list, function(object){ return compare(object,conditions) });
	return result;
}

//returns original object
//select is an array of fields
Commands._find = function(condition,select,type)
{
	var result = _.where(database[type]['records'],condition);

	if(select)
	{
		var result_select = [];

	//select some fields
	_.each(result,function(r){
		r_select = _.pick(r,select);
		result_select.push(r);
	})

    return result_select

	}
	else
    {
		return result
	}
}


Commands._findOne = function(condition,select,type)
{
	return Commands._find(condition,select,type)[0]

}

//where,type
Commands.find = function(condition,select,type)
{
	return _.clone(Commands._find(condition,select,type));
}

Commands.findOne = function(condition,select,type)
{
	return _.clone(Commands._findOne(condition,select,type) )
}




Commands.update = function(id,data,type)
{
   var record = Commands.find(id,null,type);
   _.extend(record,data);


}


Commands.delete = function(id,type)
{
    var record = Commands.findOne(id,['_id'],type);

	Pongodb.remove(record,type)

	return _.clone(record);
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
          var ref_value = _.clone( Commands.find(ref_id,ref_type) );
          record[ref_key] = ref_value;
      }

  }


 var newId = Pongodb.generateId(type);
 record["_id"] = newId;
 Pongodb.add(record,type);
 return record;

}
