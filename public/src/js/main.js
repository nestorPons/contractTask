const app = {
    provider: null,
    accounts: null,
    task: {
        data: [],
        test: function() {
            console.log(this.data)
        },
        add: function(name, description) {
            console.log('Add task...')
            let date1 = new Date()
            let date2 = new Date()
            let id = this.data.length
            date2.setDate(date1.getDate() + 1)
            this.data[id] = {
                id: id,
                name: name,
                description: description,
                status: 1, // 0 delete 1 Initial 2 Done
                create: date1.getTime(),
                expire: date2.getTime(),
            }
            this.print(id)
            this.created(id)
        },
        print: function(id) {
            const data = this.data[id]

            let card = $('#template_card').clone()
            card.attr('id', data.id)
            card.find('.name').text(data.name)
            card.find('.description').text(data.description)

            $('#container_cards').append(card)
        },
        created: async function(id) {
            console.log(that.accounts[0])
            const data = this.data[id]
            const result = await that.contract.createTask(id, data.name, data.description, data.expire, {
                from: that.accounts[0]
            })
        }
    },
    init: async function() {
        console.log('App constructor... ')
        that = this
        this.functions()
        await this.connectEthereum()
        await this.loadContracts()
        this.render()
    },
    render: function() {
        $('#account_id').text(this.accounts[0])
    },
    functions: function() {
        $('#taskFrm').on('submit', e => {
            e.preventDefault()
            let name = $('#name').val()
            let description = $('#description').val()
            this.task.add(name, description);
        })
    },
    connectEthereum: async function() {
        if (window.ethereum) {
            console.log('Window ethereum exist!')
            this.provider = window.ethereum
            this.accounts = await this.provider.request({
                method: 'eth_requestAccounts'
            })
        } else {
            console.log('Please install MetaMask!')
        }
    },
    loadContracts: async function() {
        console.log('Load contracts...')
        const res = await fetch("TaskContract.json")
        const artifac = await res.json()
        const truffle = TruffleContract(artifac)
        truffle.setProvider(this.provider)
        this.contract = await truffle.deployed()
        const tsk = await this.contract.getTask(1) //TODO Bucle print contratos

        console.log(tsk)
    }
}

console.log('Iniciaized...')
$(() => app.init())