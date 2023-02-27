import React, { Component } from 'react'
import { injectIntl, useIntl } from 'react-intl';
// @ts-ignore
import { ContentfulModulePollFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

import * as styles from './ModulePoll.module.scss';

var apiConfig = 'https://prod-31.westeurope.logic.azure.com:443/workflows/1da7898a37154f048b1550a344de6cf6/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lUMf0sMQMdIKZ85--lrmvOw-aFm6tv9S03B7qegUJ-8'

class ModulePoll extends Component<{data: ContentfulModulePollFragment, languageCode?: string, theme?: any; intl: ReturnType<typeof useIntl>, isUpcomingEvent?: boolean}>  {
  state = { 
	pollQuestion: '',
	pollAnswers: [],
	vote: null,
	poll: {
		voted: false,
		option: ''
	},
	totalVotes: 0,
	userCountry: '',
    userIp: '',
    newData: []
  }

   async componentDidMount() {
        var payload = {
            "answer": ''
        }
        await fetch(apiConfig, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            response.json().then((jsonResponse) => {
              this.setState({
                newData: jsonResponse.value
            });
        
            var keep = ['key', 'value'];
            for(var i = 0;i < this.state.newData.length; i++){

                for(var key in this.state.newData[i]){
                    if(keep.indexOf(key) === -1) delete this.state.newData[i][key];
                }

            }

            const answers = []
            // @ts-ignore
            const questionObj = this.state.newData.splice(0, 1);
            const answersObj = this.state.newData;

            // @ts-ignore
            const newKeys = answersObj.map(item => {
                return {
                    option: item.key.split("-")[0].replace(/\s+/g,' ').trim(),
                    optionAR: item.key.split("-")[1].replace(/\s+/g,' ').trim(),
                    votes: Number(item.value)
                };
            });

            newKeys.forEach(element => {
                answers.push({ option: element.option, optionAR: element.optionAR, votes: element.votes })
            });

            this.setState({
                pollQuestion: questionObj[0]['value'],
                pollAnswers: answers
            });

            const storage = this.getStoragePolls()
            const answer = storage.filter(answer => answer.question === questionObj[0]['value'])
            if (answer.length) {
                this.setState({
                    vote: this.props.languageCode === 'ar-QA' ? answer[0].optionAR : answer[0].option
                });
            }

            this.checkVote();
            this.loadVotes();

            });
        }).catch((err) => {
            console.log(`Error: ${err}` )
        });
		
		const url = 'https://www.cloudflare.com/cdn-cgi/trace';
        fetch(url)
		.then(res => res.text() ).then(t => {
			var data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
				data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
			var jsondata = JSON.parse(data);
            // @ts-ignore
            this.setState({ userCountry: jsondata.loc, userIp: jsondata.ip });
		})
        .catch(error => console.log(error));
	}

  checkVote = () => {
	const { pollQuestion } = this.state
    const storage = this.getStoragePolls()
    const answer = storage.filter(answer => answer.question === pollQuestion)
    if (answer.length) {
      this.setPollVote(answer[0].option)
    }
  }

  loadVotes = () => {
	const { pollAnswers, vote } = this.state
    pollAnswers.reduce((total, answer) => total + answer.votes, 0)
    this.setState({
      totalVotes: pollAnswers.reduce((total, answer) => total + answer.votes, 0)
    })
    if (vote) this.setPollVote(vote)
  }

  setPollVote = (answer) => {
	const { pollAnswers, vote } = this.state
    const optionsOnly = pollAnswers.map(item => item.option)
    if (optionsOnly.includes(answer)) {
      const { poll, totalVotes } = this.state
      const newPoll = { ...poll }
      newPoll.voted = true
      newPoll.option = answer

      if (!vote) {
        this.setState({
          poll: newPoll,
          totalVotes: totalVotes + 1
        })
      } else {
        this.setState({
          poll: newPoll
        })
      }
    }
  }

  handleVote = voteAnswer => {
		const { pollAnswers } = this.state
		const newPollAnswers = pollAnswers.map(answer => {
		if (answer.option === voteAnswer) answer.votes++
		    return answer
		})
		this.setState({
		    pollAnswers: newPollAnswers
		});

        var data = {
            "answer": voteAnswer,
			"country": this.state.userCountry,
            "ip": this.state.userIp
		}

        fetch(apiConfig, { 
			method: 'POST', 
			body: JSON.stringify(data), 
			headers: {'Content-Type': 'application/json'}
		})
		.catch(() => {
		});
	}

  getStoragePolls = () => JSON.parse(localStorage.getItem('react-polls')) || []

  vote = (answer) => {
	const { pollQuestion } = this.state
	const storage = this.getStoragePolls()
    const selectedOption = this.props.languageCode === 'ar-QA' ? this.getEnOption(answer) : answer
	storage.push({
        url: location.href,
        question: pollQuestion,
        option: selectedOption
	})
	localStorage.setItem('react-polls', JSON.stringify(storage))

    this.setPollVote(selectedOption)
    this.handleVote(selectedOption)
  }

  calculatePercent = (votes, total) => {
    if (votes === 0 && total === 0) {
      return '0%'
    }
	// @ts-ignore
    return `${parseInt((votes / total) * 100)}%`
  }

  // @ts-ignore
  getVotes = (option) => {
    return this.props.languageCode === 'ar-QA' ? this.state.pollAnswers.find(o => o.optionAR == option).votes : this.state.pollAnswers.find(o => o.option == option).votes
  }

  // @ts-ignore
  getEnOption = (answer) => {
    return this.state.pollAnswers.find(o => o.optionAR == answer)?.option
  }

  render() {
    const { poll, totalVotes } = this.state
    const allVotes = this.props.isUpcomingEvent ? totalVotes : this.props.data.totalVotes
    return (
		<ViewableMonitor delay={true}>
			<div className={`module-margin ${this.props.theme === 'light' ? styles.light + ' ' + 'sidebarPoll' : 'ecssPoll'} ${styles.bgGrey}`}>
				<div  className={`${styles.wrapper}`}>
					<div className={`${styles.pollContainer}`}>
                        <article className={`${styles.poll}`}>
                            <div className={styles.questionWrapper}>
                                <h2 className={styles.question}>
                                { this.props.data.question }
                                </h2>
                                {
                                    allVotes !== 0 && (
                                        <p className={styles.votes}>{allVotes} {`${allVotes !== 1 ? this.props.intl.formatMessage({ id: 'Votes'}) : this.props.intl.formatMessage({ id: 'Vote'})}`}</p>
                                    )
                                }
                            </div>
                            <div className={styles.answersWrapper}>
                                <ul className={styles.answers}>
                                {this.props.data.options?.map(answer => (
                                    <li key={answer.title}>
                                    {!poll.voted && this.props.isUpcomingEvent ? (
                                        <button className={`${styles.option}`} type='button' onClick={() => this.vote(answer.title)}>
                                            {answer.title}
                                        </button>
                                    ) : (
                                        <div className={`${styles.result}`}>
                                        {
                                            <div className={`${styles.fill}`} style={{ width: this.calculatePercent(this.props.isUpcomingEvent ? this.getVotes(answer.title) : answer.totalVotes, allVotes), transition: 'all 0.5s ease' }} />
                                        }
                                        <div className={styles.labels}>
                                            <span>{this.calculatePercent(this.props.isUpcomingEvent ? this.getVotes(answer.title) : answer.totalVotes, allVotes)}</span>
                                            <span className={`${styles.answer} ${this.props.languageCode === 'ar-QA' ? this.getEnOption(answer.title) === poll.option ? styles.vote : '' : answer.title === poll.option ? styles.vote : ''}`}>
                                                {answer.title}
                                            </span>
                                        </div>
                                        </div>
                                    )}
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </article>
					</div>
				</div>
			</div>
		</ViewableMonitor>
    )
  }
}

export default injectIntl(ModulePoll)

export const query = graphql`
	fragment ContentfulModulePollFragment on ContentfulModulePoll {
		id
        question
        options {
            title
            totalVotes
        }
        totalVotes
	}
`;