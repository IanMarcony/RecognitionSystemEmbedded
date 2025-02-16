"""Initial migration.

Revision ID: 87921d8ca84c
Revises: 
Create Date: 2024-06-25 23:32:54.215369

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '87921d8ca84c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('description', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('products')
    # ### end Alembic commands ###
