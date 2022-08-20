import AccountRepositoryInMemory from "../../repositories/in-memory/AccountRepositoryInMemory";
import IAccountRepository from "../../repositories/IAccountRepository";
import Account from "../../models/Account";
import ListAccountUseCase from "./ListAccountUseCase";

const fakeAccounts = [
  {
    username: "Lynde Rathke",
    email: "lrathke0@wired.com",
    password: "Iijl6LVwSNS",
    active: false
  },
  {
    username: "Clotilda Freezer",
    email: "cfreezer1@shop-pro.jp",
    password: "cffxC86B3ca"
  },
  {
    username: "Tara Frye",
    email: "tfrye2@tripod.com",
    password: "1NpJSPQXTK",
    active: false
  },
  {
    username: "Bridie MacGebenay",
    email: "bmacgebenay3@ftc.gov",
    password: "gAls0DAI"
  },
  {
    username: "Torrey Dominichelli",
    email: "tdominichelli4@odnoklassniki.ru",
    password: "xWnTlLmhNm4"
  },
  {
    username: "Jenifer Brinkler",
    email: "jbrinkler5@princeton.edu",
    password: "0RXhydPcpXU"
  },
  {
    username: "Rozalie Bailes",
    email: "rbailes6@dailymotion.com",
    password: "AD3U7V",
    active: false
  },
  {
    username: "Woody Lydden",
    email: "wlydden7@youtu.be",
    password: "ppKoosI0Q"
  },
  {
    username: "Hendrick Whyler",
    email: "hwhyler8@chronoengine.com",
    password: "n6R5e6VV"
  },
  {
    username: "Borg Proschek",
    email: "bproschek9@ox.ac.uk",
    password: "MnurFZbvo"
  },
  {
    username: "Benjamen Saph",
    email: "bsapha@bloglovin.com",
    password: "J0ZO7XJ"
  },
  {
    username: "Dino Vassall",
    email: "dvassallb@umn.edu",
    password: "DbSQ0tD9wn"
  },
  {
    username: "Abdul Vanns",
    email: "avannsc@redcross.org",
    password: "rKUN69W"
  },
  {
    username: "Garwood Damp",
    email: "gdampd@mlb.com",
    password: "OWt0rRN6pa9"
  },
  {
    username: "Julee Pitrasso",
    email: "jpitrassoe@reverbnation.com",
    password: "HRXPEvK97Ji"
  },
  {
    username: "Maddi Pengilley",
    email: "mpengilleyf@ask.com",
    password: "mfyKMgU1y",
    active: false
  },
  {
    username: "Jaquelyn Arnfield",
    email: "jarnfieldg@slate.com",
    password: "lKLDLh4xNj"
  },
  {
    username: "Haleigh Dysart",
    email: "hdysarth@angelfire.com",
    password: "sj5qOH8"
  },
  {
    username: "Jeffry Edghinn",
    email: "jedghinn2l@virginia.edu",
    password: "OkZ8HkdBW"
  },
  {
    username: "Selie Gytesham",
    email: "sgytesham2m@google.com.hk",
    password: "VyLUhC"
  },
  {
    username: "Berny Stoke",
    email: "bstoke2n@icio.us",
    password: "jTSOvYj"
  },
  {
    username: "Bail Fochs",
    email: "bfochs2o@deviantart.com",
    password: "GNPAWdG5n"
  },
  {
    username: "Josh Dansken",
    email: "jdansken2p@eepurl.com",
    password: "UMyWx53xY"
  },
  {
    username: "Kristyn Hubbuck",
    email: "khubbuck2q@blogger.com",
    password: "X1RJLg"
  },
]

let accountRepository: IAccountRepository
let listAccountUseCase: ListAccountUseCase;

describe('ListAccountUseCase', () => {

  beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory;
    listAccountUseCase = new ListAccountUseCase(accountRepository);
    for (const fakeAccount of fakeAccounts) {
      const {username, email, password, active} = fakeAccount;
      const account = new Account({username, email, password, active})
      accountRepository.create(account)
    }


  })

  it('should list all accounts', async () => {
    const accounts = await listAccountUseCase.execute()
    expect(accounts.length).toBe(fakeAccounts.length)
  })

  it('should list all accounts with pagination', async () => {
    const page = 1
    const limit = 10
    const accounts = await listAccountUseCase.execute({page, limit})
    expect(accounts[0].username).toBe(fakeAccounts[0].username)

    const page2 = 2
    const limit2 = 10
    const accounts2 = await listAccountUseCase.execute({page: page2, limit: limit2})
    expect(accounts2[0].username).toBe(fakeAccounts[10].username)

    const page3 = 3
    const limit3 = 10
    const accounts3 = await listAccountUseCase.execute({page: page3, limit: limit3})
    expect(accounts3[0].username).toBe(fakeAccounts[20].username)

  })

  it('should list all accounts with filter', async () => {
    const accountsActive = await listAccountUseCase.execute({
      query: {
        active: true
      }
    })

    expect(accountsActive.filter(account => !account.active).length).toBe(0)

    const accountsDefused = await listAccountUseCase.execute({
      query: {
        active: false
      }
    })

    expect(accountsDefused.filter(account => account.active).length).toBe(0)

  })

  it('should list all accounts with sort', async () => {

    const accountsAsc = await listAccountUseCase.execute({sort: 'username'})
    expect(accountsAsc[0].username < accountsAsc[1].username).toBe(true)

    const accountsDes = await listAccountUseCase.execute({sort: 'username', order: 'desc'})
    expect(accountsDes[0].username > accountsDes[1].username).toBe(true)

  })

  it('should list all accounts with filter and pagination', async () => {
    const page = 1
    const limit = 10
    const accounts = await listAccountUseCase.execute({page, limit, query: {active: true}})
    expect(accounts[0].username).toBe(fakeAccounts[1].username)
    expect(accounts.length).toBeLessThanOrEqual(10)
    expect(accounts.filter(account => !account.active).length).toBe(0)


    const page2 = 2
    const limit2 = 10
    const accounts2 = await listAccountUseCase.execute({page: page2, limit: limit2, query: {active: true}})
    expect(accounts2[0].username).toBe(fakeAccounts[13].username)
    expect(accounts2.filter(account => !account.active).length).toBe(0)


  })

  it('should list all accounts with filter and pagination and sort', async () => {
    const page = 1
    const limit = 10
    const accounts = await listAccountUseCase.execute({
      page,
      limit,
      sort: 'username',
      order: "asc",
      query: {active: true}
    })
    expect(accounts[0].username).toBe(fakeAccounts[12].username)
    expect(accounts.length).toBeLessThanOrEqual(10)
    expect(accounts.filter(account => !account.active).length).toBe(0)
    expect(accounts[0].username < accounts[1].username).toBe(true)

    const page2 = 2
    const limit2 = 10
    const accounts2 = await listAccountUseCase.execute({
      page: page2,
      limit: limit2,
      sort: 'username',
      order: "asc",
      query: {active: true}
    })
    expect(accounts2[0].username).toBe(fakeAccounts[8].username)
    expect(accounts2.filter(account => !account.active).length).toBe(0)
  })
})
