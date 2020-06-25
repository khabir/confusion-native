import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Button, Modal } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
    // postComment: () => { dispatch(postComment()) }
})

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10, alignItems: "flex-start" }}>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>{item.comment}</Text>
                <Rating imageSize={12} readonly startingValue={item.rating} />
                <Text style={{ fontSize: 12, marginTop: 10 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Card title='Comments' >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}
class RenderDish extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dish: props.dish,
            rating: props.rating,
            author: props.author,
            comment: props.comment,
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment = () => {
        console.log(JSON.stringify(this.state));
        this.props.postComment(this.state.dish.id, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    };

    render() {
        const dish = this.state.dish;
        if (dish != null) {
            return (
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.tool}>
                        <Icon
                            style={{ flex: 1 }}
                            raised
                            reverse
                            name={this.props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            style={{ flex: 1 }}
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => this.toggleModal()}
                        />
                    </View>
                    <Modal animationType={"slide"} transparent={false}
                        visible={this.state.showModal}
                        onDismiss={() => this.toggleModal()}
                        onRequestClose={() => this.toggleModal()}>
                        <View style={styles.modal}>
                            <Rating
                                showRating
                                ratingCount={5}
                                onFinishRating={value => this.setState({ rating: value })}
                                style={{ paddingVertical: 10 }}
                            />
                            <Input
                                placeholder="Author"
                                leftIcon={{ type: 'font-awesome', name: 'user-o', }}
                                onChangeText={value => this.setState({ author: value })}
                            />
                            <Input
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                onChangeText={value => this.setState({ comment: value })}
                            />
                            <Button
                                onPress={() => {
                                    this.handleComment();
                                    // this.resetForm();
                                }}
                                color="#512DA8"
                                title="Submit"
                            />
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    // this.resetForm();
                                }}
                                color="gray"
                                title="Close"
                            />
                        </View>
                    </Modal>
                </Card>
            );
        }
        else {
            return (<View></View>);
        }
    }
}

class Dishdetail extends Component {

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    render() {
        console.log(this.props.comments, 'this.props.comments');

        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish
                    dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    postComment={this.props.postComment}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    tool: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);