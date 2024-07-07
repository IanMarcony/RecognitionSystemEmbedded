"""empty message

Revision ID: 6ce9a1f74fb9
Revises: ac4689563fa3
Create Date: 2024-07-05 00:56:35.594445

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ce9a1f74fb9'
down_revision = 'ac4689563fa3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('logs_auditoria',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('id_product', sa.Integer(), nullable=True),
    sa.Column('id_category', sa.Integer(), nullable=True),
    sa.Column('imagem_capturada', sa.String(length=200), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['id_category'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['id_product'], ['products.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('logs_auditoria')
    # ### end Alembic commands ###
