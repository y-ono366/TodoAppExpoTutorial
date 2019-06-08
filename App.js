import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import {
  SearchBar,
  Input,
  Button,
  ListItem,
} from 'react-native-elements'

import FeatherIcon from 'react-native-vector-icons/Feather';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const TODO = "@todoapp.todo"
const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 :StatusBar.currentHeight;

const TodoItem = (props) => {
  let icon = null
  if (props.done === true) {
    icon = <MaterialIcon name="done"/>
  }
  return (
    <TouchableOpacity onPress={props.onPressFunc}>
      <ListItem
        title={props.title}
        rightIcon={icon}
        bottomDriver
      />
    </TouchableOpacity>
  )
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todo: [],
      currentIndex: 0,
      inputText: "",
      filterText: "",
    }
  }

  componentDidMount() {
    this.loadTodo()
  }

  loadTodo = async() => {
    try{
      const todoString = await AsyncStorage.getItem(TODO)

      if (todoString) {
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        this.setState({todo: todo,currentIndex: currentIndex})
      }
    }catch(e){
      console.log(e)
    }
  }

  saveTodo = async(todo) => {
    try {
      const todoString = JSON.stringify(todo)
      await AsyncStorage.setItem(TODO,todoString)
    }catch(e){
      console.log(e)
    }
  }

  onAddItem = () => {
    const title = this.state.inputText

    if (title == "") {
      return
    }
    const index = this.state.currentIndex + 1
    const newTodo = {index: index,title: title,done:false}
    const todo = [...this.state.todo,newTodo]
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText: "",
    })
    this.saveTodo(todo)
  }

  onTapTodoItem = (todoItem) => {
    const todo = this.state.todo
    const index = todo.indexOf(todoItem)
    todoItem.done = !todoItem.done
    todo[index] = todoItem
    this.setState({todo: todo})
    this.saveTodo(todo)
  }

  render() {
    let filterText = this.state.filterText
    let todo = this.state.todo
    if(filterText !== "") {
      todo = todo.filter(t => t.title.includes(filterText))
    }
    const platform = Platform.OS == 'ios' ? 'ios' : 'android'
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <SearchBar
          platform={platform}
          cancelButtonTitle="Cancel"
          onChangeText={(text) => this.setState({filterText: text})}
          onClear={() => this.setState({filterText: ""})}
          value={this.state.filterText}
          placeholder="type filter text"
        />
        <ScrollView style={styles.todolist}>
          <FlatList data={todo}
            extraData={this.state}
            renderItem={({item}) =>
              <TodoItem
                title={item.title}
                done={item.done}
                onPressFunc={() => this.onTapTodoItem(item)}
              />
            }
            keyExtractor={(item,index) => "todo_" + item.index}
          />
        </ScrollView>
        <View style={styles.input}>
          <Input
            onChangeText={(text) => this.setState({inputText: text})}
            value={this.state.inputText}
            containerStyle={styles.inputText}
          />

          <Button
            icon={
              <FeatherIcon
                name="plus"
                size={30}
                color='white'
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  filter: {
    height: 30,
  },
  todolist: {
    flex: 1,
  },
  input: {
    height: 50,
    flexDirection: 'row',
    paddingRight: 10,
  },
  inputText: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  inputButton: {
    width: 48,
    height: 48,
    borderWidth: 0,
    borderRadius: 48,
    borderColor: 'transparent',
    backgroundColor: '#ff6347',
  },
  todoItem: {
    fontSize: 20,
    backgroundColor: "white",
  },
  todoItemDone: {
    fontSize: 20,
    backgroundColor: "red",
  }
});
