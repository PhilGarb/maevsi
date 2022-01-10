describe('root page', () => {
  it('Displays a sign in button', () => {
    cy.visit('/')
    cy.contains('Sign in')
  })
})
